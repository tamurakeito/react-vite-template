import { useEffect, useRef } from "react";
import classes from "./styles.module.scss";
import { Center } from "tamurakeito-react-ui";
import classNames from "classnames";

export const VideoChat = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  // const [remoteSDP, setRemoteSDP] = useState<string>("");
  // const [localSDP, setLocalSDP] = useState<string>("");

  const clientId = useRef<string>(crypto.randomUUID());

  // リモートSDP設定前に送られたICE候補を一時的に保存するバッファ
  const candidateBuffer: RTCIceCandidate[] = [];

  const createPeerConnection = () => {
    // STUNサーバー設定
    const config: RTCConfiguration = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };
    const peerConnection = new RTCPeerConnection(config);

    // リモートストリームを取得
    peerConnection.ontrack = (event) => {
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

      // SDPの生成
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      // SDPを保存
      // setLocalSDP(offer.sdp || "");

      // SDPを送信
      if (socketRef.current) {
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
    // 現在のRTCPeerConnectionのインスタンスが存在しない場合は処理を終了
    if (!peerConnectionRef.current) return;

    // 受信したSDPをリモートのセッション記述として設定する
    const remoteDesc = new RTCSessionDescription({ type, sdp });
    console.log("Remote Description:", remoteDesc);
    // リモートSDPの内容が接続の一部として適用される
    await peerConnectionRef.current.setRemoteDescription(remoteDesc);

    // リモートSDPが設定された後にバッファ内のICE候補を処理
    for (const candidate of candidateBuffer) {
      try {
        await peerConnectionRef.current.addIceCandidate(candidate);
      } catch (error) {
        console.error("Error adding buffered ICE candidate:", error);
      }
    }
    console.log("buffering ICE candidate is Processed.");
    candidateBuffer.length = 0; // バッファをクリア

    if (type === "offer") {
      // SDP（answer）を生成
      const answer = await peerConnectionRef.current.createAnswer();
      // 生成したanserをローカルセッション記述として設定する
      await peerConnectionRef.current.setLocalDescription(answer);

      // setLocalSDP(answer.sdp || "");

      // SDPを送信
      if (socketRef.current) {
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

  useEffect(() => {
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
        // setRemoteSDP(message.sdp);
        handleRemoteSDP(message.sdp, "offer");
      } else if (message.type === "answer") {
        // setRemoteSDP(message.sdp);
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
  }, []);

  return (
    <Center className={classes.video_chat}>
      <div className={classes.video_grid}>
        <video
          ref={localVideoRef}
          className={classes.local_video}
          autoPlay
          playsInline
          muted
          // style={{ width: "100%", maxWidth: "480px" }}
        />
        <video
          ref={remoteVideoRef}
          className={classes.remote_video}
          autoPlay
          playsInline
          // style={{ width: "45%" }}
        />
      </div>
      <div className={classes.controls}>
        <button className={classes.control_btn}>🎤</button>
        <button className={classes.control_btn}>📷</button>
        <button className={classNames([classes.control_btn, classes.end_call])}>
          ☎️
        </button>
      </div>
    </Center>
  );
};
