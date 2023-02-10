import React, { useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

function Editor() {
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();
  const { id } = useParams();
  const toolbarOptions = [
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],

    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ direction: "rtl" }],

    [{ size: ["small", false, "large", "huge"] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],

    ["clean"],
  ];

  useEffect(() => {
    const editor = new Quill("#editor", {
      modules: {
        toolbar: toolbarOptions,
      },
      theme: "snow",
    });
    editor.disable();
    editor.setText("Loading the document...");
    setQuill(editor);
  }, []);

  useEffect(() => {
    const socketServer = io(process.env.REACT_APP_SERVER_BASE);
    setSocket(socketServer);
    return () => {
      socketServer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket || !quill) return;

    const textChange = (delta, oldData, source) => {
      if (source !== "user") return;
      socket.emit("send-changes", delta);
    };

    quill.on("text-change", textChange);

    return () => {
      quill.off("text-change", textChange);
    };
  }, [quill, socket]);

  useEffect(() => {
    if (!socket || !quill) return;

    const textChange = (delta) => {
      quill.updateContents(delta);
    };

    socket.on("recieve-changes", textChange);

    return () => {
      socket.off("text-changes", textChange);
    };
  }, [quill, socket]);

  useEffect(() => {
    if (!socket || !quill) return;

    socket.once("load-document", (document) => {
      quill.setContents(document);
      quill.enable();
    });

    socket.emit("get-document", id);
  }, [quill, socket, id]);

  useEffect(() => {
    if (!socket || !quill) return;

    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [quill, socket]);

  return (
    <div className="container">
      <div className="editor" id="editor"></div>
    </div>
  );
}

export default Editor;
