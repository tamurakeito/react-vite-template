import { ReactNode, useEffect, useRef, useState } from "react";
import classes from "./styles.module.scss";
import {
  Button,
  Center,
  Input,
  Text,
  buttonSizes,
  textColors,
} from "tamurakeito-react-ui";
import { CircleButton } from "./circle-button";
import { LogOut, Mic, MicOff, Video, VideoOff } from "react-feather";
import Spinner from "./spinner";
import classNames from "classnames";

export const VideoChat = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const clientId = useRef<string>(crypto.randomUUID());

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isRemoteVideoReady, setIsRemoteVideoReady] = useState(false);
  const [isLocalVideoRendered, setIsLocalVideoRendered] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [message, setMessage] = useState("");
  const [chatArray, setChatArray] = useState<Array<ReactNode>>([]);

  // リモートSDP設定前に送られたICE候補を一時的に保存するバッファ
  const candidateBuffer: RTCIceCandidate[] = [];

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const video = localVideoRef.current;
    if (!video) return;

    const checkVideoRendered = () => {
      // 2 = HTMLVideoElement.HAVE_CURRENT_DATA: 少なくとも1フレーム以上描出されている
      if (video.readyState >= 2) {
        setIsLocalVideoRendered(true);
      }
    };

    // 既に準備できていれば即時チェック
    checkVideoRendered();

    // `canplay` イベントで再チェック
    video.addEventListener("canplay", checkVideoRendered);

    return () => {
      video.removeEventListener("canplay", checkVideoRendered);
    };
  }, []);

  const createPeerConnection = () => {
    // STUNサーバー設定
    const config: RTCConfiguration = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };
    const peerConnection = new RTCPeerConnection(config);

    // リモートストリームを取得
    peerConnection.ontrack = (event) => {
      setIsRemoteVideoReady(true);
      console.log("remote video is ready!");
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // ICE Candidateの送信
    peerConnection.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.send(
          JSON.stringify({
            type: "candidate",
            data: event.candidate,
            clientId: clientId.current,
          })
        );
      }
    };

    // 接続の終了を監視
    peerConnection.onconnectionstatechange = () => {
      const state = peerConnection.connectionState;
      setIsRemoteVideoReady(state !== "disconnected" && state !== "failed");
    };

    return peerConnection;
  };

  const startLocalStream = async () => {
    try {
      // ローカルビデオストリームの取得
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // PeerConnectionにストリームを追加
      const peerConnection = createPeerConnection();
      peerConnectionRef.current = peerConnection;

      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });

      // データチャネルを作成
      dataChannelRef.current =
        peerConnection.createDataChannel("myDataChannel");
      recieveMessage();

      // SDPの生成
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      // SDPを送信
      if (socketRef.current) {
        console.log("offer送信");
        socketRef.current.send(
          JSON.stringify({
            type: "offer",
            sdp: offer.sdp,
            clientId: clientId.current,
          })
        );
      }
    } catch (error) {
      console.error("Error accessing media devices.", error);
    }
  };

  const handleRemoteSDP = async (sdp: string, type: "offer" | "answer") => {
    const peerConnection = peerConnectionRef.current;

    // 現在のRTCPeerConnectionのインスタンスが存在しない場合は処理を終了
    if (!peerConnection) return;

    // 受信したSDPをリモートのセッション記述として設定する
    const remoteDesc = new RTCSessionDescription({ type, sdp });
    console.log("Remote Description:", remoteDesc);
    // リモートSDPの内容が接続の一部として適用される
    await peerConnection.setRemoteDescription(remoteDesc);

    // リモートSDPが設定された後にバッファ内のICE候補を処理
    for (const candidate of candidateBuffer) {
      try {
        await peerConnection.addIceCandidate(candidate);
      } catch (error) {
        console.error("Error adding buffered ICE candidate:", error);
      }
    }
    console.log("buffering ICE candidate is Processed.");
    candidateBuffer.length = 0; // バッファをクリア

    if (type === "offer") {
      // SDP（answer）を生成
      const answer = await peerConnection.createAnswer();
      // 生成したanserをローカルセッション記述として設定する
      await peerConnection.setLocalDescription(answer);

      // 受信したデータチャネルに置き換える
      peerConnection.ondatachannel = (event) => {
        dataChannelRef.current = event.channel;
        recieveMessage();
      };
      console.log("client B として受信しました");

      // SDPを送信
      if (socketRef.current) {
        console.log("answer送信");
        socketRef.current.send(
          JSON.stringify({
            type: "answer",
            sdp: answer.sdp,
            clientId: clientId.current,
          })
        );
      }
    }
  };

  const handleNewICECandidate = async (candidate: RTCIceCandidate) => {
    if (peerConnectionRef.current?.remoteDescription) {
      await peerConnectionRef.current.addIceCandidate(candidate);
    } else {
      console.warn("Remote description not set, buffering ICE candidate");
      candidateBuffer.push(candidate);
    }
  };

  const startCall = () => {
    startLocalStream();

    const socket = new WebSocket("ws://localhost:8081/ws");
    socketRef.current = socket;

    socket.onmessage = async (event) => {
      const textData =
        typeof event.data === "string"
          ? event.data // 文字列ならそのまま
          : await event.data.text();

      const message = JSON.parse(textData); // JSONとしてパース

      // 自分のメッセージは無視
      if (message.clientId === clientId.current) return;

      if (message.type === "offer") {
        console.log("offer 受信");
        handleRemoteSDP(message.sdp, "offer");
      } else if (message.type === "answer") {
        console.log("answer 受信");
        handleRemoteSDP(message.sdp, "answer");
      } else if (message.type === "candidate") {
        handleNewICECandidate(message.data);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      // コンポーネントアンマウント時に接続を閉じる
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  };

  const endCall = () => {
    const peerConnection = peerConnectionRef.current;
    if (peerConnection) {
      const streams = peerConnection.getSenders().map((sender) => sender.track);
      streams.forEach((track) => track?.stop());
      peerConnection.close();
    }
  };

  // 任意のメッセージをdataChannelを経由して送信する
  const sendMessage = (message: string) => {
    if (
      dataChannelRef.current &&
      dataChannelRef.current.readyState === "open"
    ) {
      dataChannelRef.current.send(message);
      setChatArray((prev) => [
        ...prev,
        <ChatNode isSender={true}>{message}</ChatNode>,
      ]);
    } else {
      console.log("データチャネルが開いていません");
    }
  };

  const recieveMessage = () => {
    const dataChannel = dataChannelRef.current;

    if (!dataChannel) return;

    dataChannel.onmessage = (event: MessageEvent) => {
      setChatArray((prev) => [
        ...prev,
        <ChatNode isSender={false}>{event.data}</ChatNode>,
      ]);
    };

    // クリーンアップ: dataChannel が変更されたら古いリスナーを削除
    return () => {
      dataChannel.onmessage = null;
    };
  };

  return (
    <>
      <div
        className={classes.video_chat}
        style={{ width: screenWidth - 20, height: screenWidth * 0.6 - 12 }}
      >
        {!isVideoReady && (
          <Center className={classes.video_standby}>
            <Button
              onClick={() => {
                startCall();
                setIsVideoReady(true);
              }}
            >
              <Text color={textColors.white}>ビデオ通話を開始します</Text>
            </Button>
          </Center>
        )}
        <video
          ref={localVideoRef}
          className={classes.local_video}
          autoPlay
          playsInline
          muted
          style={{ display: !isCameraOff ? "block" : "none" }}
        />
        {!isLocalVideoRendered && (
          <Center className={classes.local_standby}>
            <Spinner size={16} />
          </Center>
        )}
        {isCameraOff && (
          <Center className={classes.local_standby}>
            <Text color={textColors.white}>画面オフ</Text>
          </Center>
        )}
        <video
          ref={remoteVideoRef}
          className={classes.remote_video}
          autoPlay
          playsInline
          style={{ display: isRemoteVideoReady ? "block" : "none" }}
        />
        {!isRemoteVideoReady && (
          <Center className={classes.remote_standby}>
            <Text color={textColors.white}>
              接続されるまで少々お待ちください
            </Text>
          </Center>
        )}
        {isMuted && (
          <div className={classes.mute_icon}>
            <MicOff size={24} color={"grey"} />
          </div>
        )}
        <div className={classes.controls}>
          <CircleButton
            size={buttonSizes.md}
            onClick={() => {
              setIsMuted(!isMuted);
            }}
          >
            {!isMuted ? <MicOff /> : <Mic />}
          </CircleButton>
          <CircleButton
            size={buttonSizes.md}
            onClick={() => {
              setIsCameraOff(!isCameraOff);
            }}
          >
            {!isCameraOff ? <VideoOff /> : <Video />}
          </CircleButton>
          <CircleButton
            size={buttonSizes.md}
            disabled={!isRemoteVideoReady}
            onClick={() => {
              endCall();
            }}
          >
            <LogOut />
          </CircleButton>
        </div>
        <div className={classes.chat_area}>
          {chatArray.map((data, index) => (
            <span key={index}>{data}</span>
          ))}
        </div>
      </div>
      <Center>
        <Input
          value={message}
          placeholder={"メッセージを入力してください"}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              sendMessage(message);
              setMessage("");
            }
          }}
        />
      </Center>
    </>
  );
};

const ChatNode = ({
  children,
  isSender,
}: {
  children: ReactNode;
  isSender: boolean;
}) => {
  return (
    <div className={classNames([classes.chat_node])}>
      <Text color={isSender ? textColors.gray500 : textColors.gray100}>
        {children}
      </Text>
    </div>
  );
};
