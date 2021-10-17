import React, { useEffect, useRef } from "react";
import "../popUp.css";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import EditIcon from "@material-ui/icons/Edit";
import ResultDetail from "./ResultDetail";

function useOutsideAlerter(ref, props) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        props.onClick(null);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

function PredictInfoPopUp(props) {
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, props);

  var toolTipStyle = {
    display: "none",
    background: "#C8C8C8",
    marginTop: "20px",
    padding: "10px",
    position: "absolute",
    zIndex: "2000",
  };

  function downloadAllImage() {
    var zip = JSZip();
    let folder = zip.folder("predict");
    let picCount = 0;
    props.results.map((val, index) => {
      Object.entries(val).map(([key, value]) => {
        if (key !== "image" && value !== null) {
          picCount++;
          const imageBlob = fetch(value).then((response) => response.blob());
          let fileName = value.split("/")[value.split("/").length - 1];
          folder.file(fileName, imageBlob);
        }
      });
    });
    if (picCount === 0) {
      return;
    }
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "predict.zip");
    });
  }

  const imageList = props.results.map(ResultDetail);
  console.log(imageList);

  return (
    <div className="popUp-background">
      <div
        className="popUp"
        style={{ textAlign: "start", overflowY: "scroll" }}
        ref={wrapperRef}
      >
        <EditIcon
          style={{ float: "right", margin: "20px" }}
          onClick={() => {
            window.location.href = "/newPredict?id=" + props.id;
          }}
        />
        <div style={{ margin: "20px" }}>
          <h2 style={{ fontWeight: "700" }}>
            {props.created_at.split("T")[0]}{" "}
            {props.created_at.split("T")[1].slice(0, -1)}
          </h2>
          {imageList}
          <div className="center-button">
            <button className="upload-button" onClick={downloadAllImage}>
              下載所有圖片
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PredictInfoPopUp;
