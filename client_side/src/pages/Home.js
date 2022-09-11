import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import NumberDetection from '../components/NumberDetection/NumberDetection';
import "./Home.css";
import BugReportOutlinedIcon from '@mui/icons-material/BugReportOutlined';
import TaskOutlinedIcon from '@mui/icons-material/TaskOutlined';
import { channels } from '../shared/constants';
const { ipcRenderer } = window.require('electron');
export default function Home() {
    function getFilePath() {
        ipcRenderer.send(channels.GET_PATH);
    }
    const [scan, setScan] = useState('');
    const [malwareDetected, setMalwareDetected] = useState(true);

    useEffect(() => {

        // Listen for the event

        ipcRenderer.on(channels.GET_PATH_REPLY, (event, arg) => {
            setScan(arg)
            setMalwareDetected(true);
            console.log(arg);

        });

        // Clean the listener after the component is dismounted

        return () => {

            ipcRenderer.removeAllListeners();

        };

    }, [scan]);

    // useEffect(() => {
    //     ipcRenderer.send(channels.GET_POPUP,{filePath:scan});

    // },[scan]);
    return (
        <div className='home'>
            <Navbar />
            <div className='home-child'>
                <div className='home-child-1'>
                    {malwareDetected?<img style={{display:scan.length>0?"none":"block"}} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAAERklEQVRoge2ZT08bRxjGn3dApKIgN603xhZ1iiAEk+LD7mFJo1y7PvSzBNReyjdoT4n6ZSrkc6VYUSuV1PRPkDDiT2sZVUwacwB2nh4MBBqvd9ZrDpX8SJYlduaZ57f2vH53AIYaaqih/jfiYy/PR/cnb8z/0f1JPvbySeYoa/PPyk94drpLc2uby2U/ebwY/+WyT3Nrm2enu3xYXrGdJzaDwoflVRBPryz3WlECqW08Tx71XdFf8oxIFcDtt3+UtZHaz9/EzY0FCP3yKsGnXS69NpBgLCXEib/kKeB6+Lfh1kZqL3tC9AQ48T9dAfGsxxANZYKx55s1u7j/8V9e9GHUOoBM5CBiZezFL99FXY4EaHul/KhSuwBGYnJoMQzGfkwGceIt+lTSO3xH4SkwPfGi/le3i5GbePw98wbEEQnEvDJGZP3YW7Te2Mfeom9E1klk4vxBHL1/jDdRXpEA8sPv/5zRfE7yb5KIeWUEsn7slpbjwrfdBU8B35PMxPtCh8Z8IfV6JEDsJm57JRcGVQg+jBsLQAtQGf/p164bu+0ueIB03bBJvS5kVUbb5ZJLxSpgB6GUvLNw213waLpXG1uPbrICADoQRow1hKGqZDY6AdpLC57p3ACr8FfnxskaAACOyiVXwR6CUBWSp0rswxP24YGEAACgy/d80qr8AYA+f7caK8Igs/EqUTlODAAAR+U5l0ZsPwkbaWUQZDaThQf6BACAo9KcaxQGAaENJcj2ER5IAQAArdKcqwRVgP1BCDSp+g7fsUipVmnOBfqC0CLpwgMDAAA6EIamKvZfJ22UCaY2G6nCA8BoWgMAACkwFCaZczaYm5fa5GC26I2MqCppVeevSoOoTG01Uj1PpAI4mC16EGX7I9VNWiEdRN8AB7NFj/aNWa8A2ohUpvuE6AvgYLboGVo3ZjbSMKoy3UgOkRhg95NpH3IzrQTI4OPG3s21EjvFogdl7FtiIAhpTqWzT+y6WLAy09gffDO3Uyx6FPvwFAQz53ezcbfgAvYQFHsIK4CdYt4zsK42GkaCmb3rX4XG3YJLWjeAGgpWELEAW8W8p0ySx0D1TvgLNQqFJA2gFkplZr83RE+ArXzeg7KtNqKNhMH8XrPnJnxVKLgQWrYdoomwcm+/GQkRCfBbNjs5Mja6DeCj+IWgqRgb/kJ/TOd8MdaV7PDkNJx50Gp1PZmIPFYxwASJD2LPhQDN0D48AMzvNWsMGRDQFudOt8eBiSivSIDFw8M/YfhlzNmNRshgvmkf/hKi2awhZEBS91rDGH4102p1PZUDLDbxZi63Kt0Pd7WBBA/6CH/Nv5B1JYwqsVwrNVv9H+5eLpLLroJyFUJTVOrwl/7ZrAulrj8UEV8vtlrfDsK/s4jjrNQd56zuOK16Ljfwf3DUczm/7jiH52s8GbQ/AODlnTu5uuNEbqi0qjvORN1xpm7Kf6ihhhpq8PoX4YWLivLqM2oAAAAASUVORK5CYII=" alt="cross" />:<img style={{display:scan.length>0?"none":"block"}} alt="svgImg" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iOTYiIGhlaWdodD0iOTYiCnZpZXdCb3g9IjAgMCA0OCA0OCIKc3R5bGU9IiBmaWxsOiMwMDAwMDA7Ij48cGF0aCBmaWxsPSIjYzhlNmM5IiBkPSJNMzYsNDJIMTJjLTMuMzE0LDAtNi0yLjY4Ni02LTZWMTJjMC0zLjMxNCwyLjY4Ni02LDYtNmgyNGMzLjMxNCwwLDYsMi42ODYsNiw2djI0QzQyLDM5LjMxNCwzOS4zMTQsNDIsMzYsNDJ6Ij48L3BhdGg+PHBhdGggZmlsbD0iIzRjYWY1MCIgZD0iTTM0LjU4NSAxNC41ODZMMjEuMDE0IDI4LjE3MiAxNS40MTMgMjIuNTg0IDEyLjU4NyAyNS40MTYgMjEuMDE5IDMzLjgyOCAzNy40MTUgMTcuNDE0eiI+PC9wYXRoPjwvc3ZnPg==" />}
                    <p style={{
                        color:scan.length>0?"white":malwareDetected?"red":"green"
                        }
                    }>{scan.length>0?"Scanning...":malwareDetected?"System at Risk":"System is Secure"}</p>
                </div>
                <div className='scan-button-container'>
                    <div className='scan-button' style={{display:scan.length>0?"none":"block"}} onClick={getFilePath}>
                        <p>
                            Scan
                        </p>
                    </div>
                    <img src='1496.gif' alt="loading..." style={{display:scan.length>0?"block":"none"}}/>
                    <div className='scan-file-name'>{scan}</div>
                </div>
                <div className='home-child-heading'>
                    Malware Detected <BugReportOutlinedIcon />
                </div>
                <div className='home-child-2'>
                    <NumberDetection text={"All time"} num={" 69"} />
                    <NumberDetection text={"Last 30 days"} num={"200"} />
                    <NumberDetection text={"Today"} num={"200"} />

                </div>
                <div className='home-child-heading'>
                    File Scanned <TaskOutlinedIcon />
                </div>
                <div className='home-child-2'>
                    <NumberDetection text={"All time"} num={" 69"} />
                    <NumberDetection text={"Last 30 days"} num={"200"} />
                    <NumberDetection text={"Today"} num={"200"} />
                </div>
            </div>
            {/* <CyberAwareness /> */}
        </div>
    )
}