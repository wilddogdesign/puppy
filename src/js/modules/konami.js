/* eslint-disable */
const whoLetTheDogsOut = () => {
  const div = document.createElement("div");

  const style = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 20000,
    background: "rgba(255, 255, 255, 0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "15%",
  };

  Object.keys(style).forEach((k) => (div.style[k] = style[k]));

  div.innerHTML = `<div style="position:relative;overflow:hidden;padding-top:56.25%;width:100%;">
      <iframe src="https://www.youtube.com/embed/Qkuu0Lwb5EM?autoplay=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;"></iframe></div>`;

  document.body.append(div);

  div.addEventListener("click", () => div.parentNode.removeChild(div));
};

export default (konami = "up,up,down,down,left,right,left,right,b,a") => {
  const script = document.createElement("script");
  script.src = "https://cdnjs.cloudflare.com/ajax/libs/egg.js/1.0/egg.min.js";
  // eslint-disable-next-line
  script.onload = () => new Egg(konami, whoLetTheDogsOut).listen();
  document.body.append(script);
};
/* eslint-enable */
