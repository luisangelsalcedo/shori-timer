import { stopAlarm } from "../utils/audio";

const imageTimer = `<svg id="timer" width="18" height="20" viewBox="0 0 18 20" xmlns="http://www.w3.org/2000/svg"><path d="M6.86588 0C6.76329 0 6.6649 0.0421427 6.59236 0.117157C6.51982 0.192172 6.47907 0.293913 6.47907 0.4V1.2C6.47907 1.30609 6.51982 1.40783 6.59236 1.48284C6.6649 1.55786 6.76329 1.6 6.86588 1.6H7.44609V2.659C3.26158 3.157 0 6.8418 0 11.3C0 16.0966 3.77469 20 8.41312 20C13.0516 20 16.8262 16.0966 16.8262 11.3C16.8276 9.65826 16.3768 8.05008 15.5266 6.6636L16.3462 5.9774L16.7114 6.4438C16.7433 6.48464 16.7827 6.51858 16.8274 6.54367C16.872 6.56876 16.921 6.58451 16.9715 6.59003C17.022 6.59555 17.0731 6.59072 17.1218 6.57582C17.1705 6.56092 17.2159 6.53624 17.2554 6.5032L17.8569 5.9996C17.9365 5.93279 17.9872 5.83603 17.9979 5.73057C18.0086 5.62511 17.9783 5.51959 17.9138 5.4372L15.9666 2.95C15.9346 2.90916 15.8952 2.87522 15.8506 2.85013C15.8059 2.82504 15.7569 2.80929 15.7064 2.80377C15.6559 2.79825 15.6048 2.80308 15.5561 2.81798C15.5074 2.83288 15.462 2.85756 15.4225 2.8906L14.821 3.3942C14.7414 3.46101 14.6907 3.55777 14.68 3.66323C14.6694 3.76869 14.6996 3.87421 14.7642 3.9566L15.1295 4.423L14.3133 5.1058C13.0104 3.7782 11.2916 2.887 9.38015 2.6594V1.6H9.96036C10.0629 1.6 10.1613 1.55786 10.2339 1.48284C10.3064 1.40783 10.3472 1.30609 10.3472 1.2V0.4C10.3472 0.293913 10.3064 0.192172 10.2339 0.117157C10.1613 0.0421427 10.0629 0 9.96036 0L6.86588 0ZM8.41312 4C12.3199 4 15.4724 7.26 15.4724 11.3C15.4724 15.34 12.3199 18.6 8.41312 18.6C4.50634 18.6 1.35384 15.34 1.35384 11.3C1.35384 7.26 4.50634 4 8.41312 4ZM8.41351 5.4886L8.41312 11.3L12.9067 14.7894C13.5335 13.9262 13.9154 12.8995 14.0096 11.8245C14.1039 10.7494 13.9066 9.66846 13.4401 8.7028C12.9736 7.73717 12.2562 6.925 11.3684 6.35732C10.4805 5.78964 9.45735 5.4887 8.41351 5.4886Z" fill="#545F71"/></svg>`;
const imageAlamr = `<svg id="alarm" width="20" height="18" viewBox="0 0 20 18" xmlns="http://www.w3.org/2000/svg"><path d="M4.29297 6.71089C4.10547 6.8984 3.8511 7.00382 3.58594 7.00386H2V11.0039H3.58594L3.68457 11.0087C3.91352 11.0315 4.12886 11.1327 4.29297 11.2968L9 16.0039V2.00386L4.29297 6.71089ZM15.6572 1.93257C16.0478 1.54229 16.6808 1.54213 17.0713 1.93257C20.9765 5.83782 20.9765 12.1699 17.0713 16.0752C16.6809 16.4655 16.0478 16.4654 15.6572 16.0752C15.2667 15.6846 15.2668 15.0516 15.6572 14.6611C18.7814 11.5369 18.7814 6.47083 15.6572 3.34664C15.2667 2.95611 15.2667 2.3231 15.6572 1.93257ZM12.8281 4.76168C13.2186 4.37115 13.8517 4.37115 14.2422 4.76168C16.5853 7.10482 16.5853 10.9029 14.2422 13.2461C13.8517 13.6366 13.2186 13.6366 12.8281 13.2461C12.438 12.8555 12.4377 12.2224 12.8281 11.832C14.3902 10.2699 14.3902 7.73783 12.8281 6.17574C12.4377 5.78534 12.438 5.15223 12.8281 4.76168ZM11 16.0039C11 17.7857 8.84587 18.6779 7.58594 17.4179L3.17188 13.0039H2C0.89543 13.0039 0 12.1084 0 11.0039V7.00386C2.78315e-05 5.89932 0.895448 5.00386 2 5.00386H3.17188L7.58594 0.589801C8.84586 -0.670079 11 0.2221 11 2.00386V16.0039Z" fill="#545F71"/></svg>`;

export const divTimer = document.createElement("div");
divTimer.style.position = "absolute";
divTimer.style.backgroundColor = "white";
divTimer.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, .2)";
divTimer.style.top = "100%";
divTimer.style.right = "1rem";
divTimer.style.padding = ".5rem 1rem";
divTimer.style.fontSize = "1.3rem";
divTimer.style.borderRadius = "0 0 8px 8px";
divTimer.style.display = "none";


export const divTimerContent = document.createElement("div");
divTimerContent.style.color = "BLUE";
divTimerContent.style.fontWeight = "bold";


const divTimerTop = document.createElement("div");
divTimerTop.style.display = "flex";
divTimerTop.style.alignItems = "center";
divTimerTop.style.justifyContent = "center";
divTimerTop.style.gap = "10px";


export const divTimerBottom = document.createElement("div");
divTimerBottom.style.fontSize = "11px";
divTimerBottom.style.whiteSpace = "nowrap";
divTimerBottom.style.overflow = "hidden";
divTimerBottom.style.textOverflow = "ellipsis";
divTimerBottom.style.width = "100%";  
divTimerBottom.style.textAlign = "center";



divTimerTop.innerHTML = imageAlamr + imageTimer; 
divTimerTop.append(divTimerContent)
divTimer.append(divTimerTop);



export const svgtime = divTimerTop.querySelector("#timer");
svgtime.style.width = "16px";
svgtime.style.height = "16px";
svgtime.querySelector("path").style.fill = "#005b96"

export const svgalarm = divTimerTop.querySelector("#alarm");
svgalarm.style.width = "16px";
svgalarm.style.height = "16px";
svgalarm.style.display = "none";
svgalarm.style.cursor = "pointer";
svgalarm.querySelector("path").style.fill = "#960000ff"

svgalarm.addEventListener('click', ()=>{
    stopAlarm()
    svgalarm.style.display = "none";
    svgtime.style.display = "block";
})


export const btnRefreshTimer = document.createElement("button");
btnRefreshTimer.innerText = "Reload";
btnRefreshTimer.style.color = "white";
btnRefreshTimer.style.padding = "5px";



