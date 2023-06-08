import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "../utils/axios";
import { MdSwapVert } from "react-icons/md";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Background from "../components/background";
import swal from "sweetalert";
import Modal from "../components/Modal";

export default function Dasboard() {
  const interval = 1000
  const [countdown, setCountdown] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [injuryTime, setInjuryTime] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [change, setChange] = useState("");
  const [indexChange, setIndexChange] = useState();
  const [idChange, setIdChange] = useState()
  const [idAway, setIdAway] = useState()
  const [idHome, setIdHome] = useState()
  // Form match
  const [homeTeam, setHomeTeam] = useState();
  const [awayTeam, setAwayTeam] = useState();
  const [matchId, setMatchId] = useState();

  // Data hasil fetch
  const [team, setTeam] = useState([]);
  // For match
  const [playerHome, setPlayerHome] = useState([]);
  const [playerHomeCadangan, setPlayerHomeCadangan] = useState([]);
  const [playerAway, setPlayerAway] = useState([]);
  const [playerAwayCadangan, setPlayerAwayCadangan] = useState([]);
  const [scoreHome, setScoreHome] = useState(0);
  const [scoreAway, setScoreAway] = useState(0);

  const [team1Possession, setTeam1Possession] = useState(0);
  const [team2Possession, setTeam2Possession] = useState(0);
  const [isTeam1Running, setIsTeam1Running] = useState(false);
  const [isTeam2Running, setIsTeam2Running] = useState(false);

  const handlePause = () => {
    setIsRunning(false);
    setIsTeam1Running(false);
    setIsTeam2Running(false);
  };

  const handleTeam1Possession = () => {

    if (!isRunning) return;
    setIsTeam1Running((prev) => !prev);
    setIsTeam2Running(false);
  };

  const handleTeam2Possession = () => {
    if (!isRunning) return;
    setIsTeam2Running((prev) => !prev);
    setIsTeam1Running(false);
  };

  useEffect(() => {
    let timer = null;

    if (isRunning) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown + 1);
      }, interval);
    }

    return () => {
      clearInterval(timer);
    };
  }, [isRunning]);

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  const getTeam = async () => {
    const res = await axios.get("team");
    setTeam(res.data.data);
  };

  const switchPlayerHome = (index, id_player) => {
    setIdChange(id_player)
    setIndexChange(index);
    setChange("home");
    setOpenModal(true);
  };
  const switchPlayerAway = (index, id_player) => {
    setIdChange(id_player)
    setIndexChange(index);
    setChange("away");
    setOpenModal(true);
  };

  const tambahanWaktu = () => {
    if (matchId) {
      setInjuryTime((prev) => prev + 60);
      swal({
        title: "+1 menit",
        icon: "success",
      });
    } else {
      swal({
        title: "permainan belum di mulai",
        icon: "warning",
      });
    }
  };

  const yellowCard = async (player, name) => {
    const data = {
      match_id: matchId,
      player_id: player,
      card_type: "yellow",
      card_time: minutes,
    };
    await axios
      .post("card/add", data)
      .then((res) => {
        if (res.status === 201)
          swal({
            title: `Player ${name} diberi kartu kuning`,
            icon: "warning",
          });
      })
      .catch();
  };
  const redCard = async (player, name) => {
    const data = {
      match_id: matchId,
      player_id: player,
      card_type: "red",
      card_time: minutes,
    };
    await axios
      .post("card/add", data)
      .then((res) => {
        if (res.status === 201)
          swal({
            title: `Player ${name} diberi kartu Merah`,
            icon: "warning",
          });
      })
      .catch();
  };

  const offSides = async (player, id_team) => {
    const data = {
      match_id: matchId,
      offset_team_id: id_team,
      offset_time: minutes
    };
    await axios.post("os/", data)
      .then(res => {
        swal({
          title: "team ini offside",
          icon: "warning"
        })
      })
      .catch(err => { })
  };

  const goalButton = async (player, team) => {
    await axios
      .post("goal/add", {
        match_id: matchId,
        player_id: player,
        goal_time: minutes,
      })
      .then(async (res) => {
        if (res.status === 201)
          swal({
            title: "horeeee goal",
            icon: "success",
          });
        await axios.get(`goal/${matchId}/${team}`).then((res) => {
          setScoreHome(res.data.data);
        }).catch;
      })
      .catch((err) => {
        swal({
          title: "cant add goal",
          icon: "warning",
        });
      });
  };
  const goalButtonAway = async (player, team) => {
    await axios
      .post("goal/add", {
        match_id: matchId,
        player_id: player,
        goal_time: minutes,
      })
      .then(async (res) => {
        if (res.status === 201)
          swal({
            title: "horeeee goal",
            icon: "success",
          });
        await axios
          .get(`goal/${matchId}/${team}`)
          .then((res) => {
            setScoreAway(res.data.data);
          })
          .catch();
      })
      .catch((err) => {
        swal({
          title: "cant add goal",
          icon: "warning",
        });
      });
  };

  const onPLayMatch = async () => {
    setIsRunning(true);
    if (!matchId) {
      await axios
        .post("match/add", {
          homeTeam: homeTeam,
          awayTeam: awayTeam,
        })
        .then((res) => {
          setMatchId(res.data.data.id);
        })
        .catch((err) => {
          setCountdown(0);
          setIsRunning(false);
          console.log(err);
          swal({
            title: err.response.data.msg,
            icon: "warning",
          });
        });
    }
  };

  const onChangeHandleHome = async (e, data) => {
    setHomeTeam(data);

    if (data) {
      const res = await axios.get("player/id/" + data + "/" + "main");
      setPlayerHome(res.data.data);
      console.log(data);
      const resCadangan = await axios.get(
        "player/id/" + data + "/" + "cadangan"
      );
      setPlayerHomeCadangan(resCadangan.data.data);
    } else {
      setPlayerHome([]);
      setPlayerHomeCadangan([]);
    }
  };
  const onChangeHandleAway = async (e, data) => {
    setAwayTeam(data);
    if (data) {
      const res = await axios.get("player/id/" + data + "/" + "main");
      setPlayerAway(res.data.data);
      console.log(data);
      const resCadangan = await axios.get(
        "player/id/" + data + "/" + "cadangan"
      );
      setPlayerAwayCadangan(resCadangan.data.data);
    } else {
      setPlayerAway([]);
      setPlayerAwayCadangan([]);
    }
  };

  const submitSwitch = (id_player_in, index, team) => {
    if (team === "home") {
      let playerWillOut = playerHome[indexChange]
      let playerWillIn = playerHomeCadangan[index]

      
      axios.post("switch", {
        match_id: matchId,
        player_out_id: playerWillOut.id,
        player_in_id: playerWillIn.id,
        switch_time: minutes
      })
        .then(res => {
          setPlayerHome(prevArray => {
            const newArray = [...prevArray];
            newArray[indexChange] = playerWillIn;
            return newArray;
          });
          setPlayerHomeCadangan(prevArray => {
            const newArray = [...prevArray];
            newArray[index] = playerWillOut;
            return newArray;
          });
          setOpenModal(false)

        })
        .catch(err => {
          swal({
            title: "cant switch"
          })
        })
    } else {
      let playerWillOut = playerAway[indexChange]
      let playerWillIn = playerAwayCadangan[index]

      
      axios.post("switch", {
        match_id: matchId,
        player_out_id: playerWillOut.id,
        player_in_id: playerWillIn.id,
        switch_time: minutes
      })
        .then(res => {
          setPlayerAway(prevArray => {
            const newArray = [...prevArray];
            newArray[indexChange] = playerWillIn;
            return newArray;
          });
          setPlayerAwayCadangan(prevArray => {
            const newArray = [...prevArray];
            newArray[index] = playerWillOut;
            return newArray;
          });
          setOpenModal(false)

          
        })
        .catch(err => {
          swal({
            title: "cant switch"
          })
        })
    }
  }

  useEffect(() => {
    getTeam();
  }, []);

  useEffect(() => {
    if (countdown === 1800) {
      setIsRunning(false);
      swal({
        title: "Babak Pertama selesai",
        icon: "warning",
      });

    }
    if (countdown === 3600 + injuryTime) {
      setIsRunning(false);
      setInjuryTime(0);
      swal({
        title: "Time is Over",
        icon: "warning",
      });
      axios.post("bp/", {
        time: countdown,
        possession_time: team1Possession,
        match_id: matchId,
        team_id: idHome
      })
      axios.post("bp/", {
        time: countdown,
        possession_time: team2Possession,
        match_id: matchId,
        team_id: idAway
      })
    }
  }, [countdown]);

  useEffect(() => {
    let intervalId;

    if (isRunning) {
      intervalId = setInterval(() => {
        if (isTeam1Running) {
          setTeam1Possession((prevPossession) => prevPossession + 1);
        }

        if (isTeam2Running) {
          setTeam2Possession((prevPossession) => prevPossession + 1);
        }
      }, interval);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isRunning, isTeam1Running, isTeam2Running]);

  console.log(team1Possession);
  console.log(team2Possession);
  console.log("injury time ", injuryTime);

  return (
    <div className="font-Poppins">
      <Navbar />
      <Background />
      <main className="mt-4 w-full h-full px-6 z-1 main-content">
        <div className="flex justify-between items-center h-1/2">
          <div className="w-1/3">
            <div className="flex flex-rows justify-center ">
              <label
                htmlFor="homeTeam"
                className="block text-white text-2xl mr-3 font-bold"
              >
                Home Team
              </label>
              <select
                id="homeTeam"
                name=""
                className="shadow appearance-none border rounded w-40 py-2 px-3 text-base text-center text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={homeTeam}
                onChange={(e) => {
                  setIdHome(e.target.value)
                  onChangeHandleHome(e, e.target.value)
                }}
              >
                <option value="">---Pilih Team---</option>
                {team.map((data) => (
                  <option key={data.id} value={data.id}>
                    {data.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-center">
              <h3 className="text-6xl text-white font-bold pt-10">
                {scoreHome}
              </h3>
            </div>
          </div>
          <div className="w-1/3 flex flex-col items-center bg-slate-200">
            <div className="flex justify-center">
              <div className="w-full py-5 text-center">
                <h1 className="text-2xl font-semibold">Time</h1>
                <h2 className="text-3xl my-5 font-bold">
                  {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                </h2>
                <div className="flex justify-center w-full ">
                  {!isTeam1Running ? (
                    <button
                      className="p-2 rounded-lg bg-blue-600 hover:bg-blue-800 text-slate-100 flex items-center"
                      onClick={handleTeam1Possession}
                    >
                      <IoIosArrowBack className="mr-2" /> Posession
                    </button>
                  ) : (
                    <button
                      className="p-2 rounded-lg bg-blue-800 hover::bg-blue-600 text-slate-100 flex items-center"
                      onClick={handleTeam1Possession}
                    >
                      <IoIosArrowBack className="mr-2" /> Posession
                    </button>
                  )}
                  {!isRunning ? (
                    <button
                      className="bg-green-600 hover:bg-green-700 p-2 w-20 mx-3 rounded-lg text-slate-50"
                      onClick={onPLayMatch}
                    >
                      Start
                    </button>
                  ) : (
                    <button
                      className="bg-yellow-500 hover:bg-yellow-700 w-20 p-2 mx-3 rounded-lg text-slate-100"
                      onClick={handlePause}
                    >
                      Pause
                    </button>
                  )}
                  <button
                    onClick={() => tambahanWaktu()}
                    className="p-2 rounded-lg w-20 bg-red-600 mr-3 hover:bg-red-700 text-slate-100"
                  >
                    1 menit
                  </button>
                  {!isTeam2Running ? (
                    <button
                      className="p-2 rounded-lg bg-blue-600 hover:bg-blue-800 text-slate-100 flex items-center"
                      onClick={handleTeam2Possession}
                    >
                      Posession <IoIosArrowForward className="mr-2" />
                    </button>
                  ) : (
                    <button
                      className="p-2 rounded-lg bg-blue-800 hover::bg-blue-600 text-slate-100 flex items-center"
                      onClick={handleTeam2Possession}
                    >
                      Posession <IoIosArrowForward className="mr-2" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="w-1/3">
            <div className="flex flex-rows justify-center ">
              <label
                htmlFor="awayTeam"
                className="block text-white text-2xl mr-3 font-bold"
              >
                Away Team
              </label>
              <select
                id="awayTeam"
                name=""
                className="shadow appearance-none border rounded w-40 py-2 px-3 text-base text-center text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={awayTeam}
                onChange={(e) => {
                  setIdAway(e.target.value)
                  onChangeHandleAway(e, e.target.value)
                }}
              >
                <option value="">---Pilih Team---</option>
                {team.map((data) => (
                  <option key={data.id} value={data.id}>
                    {data.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-center">
              <h3 className="text-6xl text-white font-bold pt-10">
                {scoreAway}
              </h3>
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="team w-1/2 mt-10 ">
            {playerHome.map((data, index) => (
              <div key={data.numberJersey} className="flex">
                <button
                  onClick={() => goalButton(data.id, data.team_id)}
                  className="text-slate-100 py-2 px-3 rounded z-[1] bg-slate-800 hover:bg-slate-900 w-14 h-14 flex justify-center items-center"
                >
                  {data.numberJersey}
                </button>
                <h3 className="flex items-center bg-slate-700 text-slate-100 rounded-r-xl -ml-4 h-14 pl-8 w-56 capitalize">
                  {data.name}
                </h3>
                <h3 className="w-[4.5rem] -z-[1] h-14 flex -ml-4 pl-4 items-center justify-center text-slate-100 bg-slate-600 rounded">
                  {data.position}
                </h3>

                <div className="ml-5">
                  <button
                    onClick={() => yellowCard(data.id, data.name)}
                    className="w-10 h-14 bg-yellow-300 rounded"
                  ></button>
                </div>
                <div className="ml-5">
                  <button
                    onClick={() => redCard(data.id, data.name)}
                    className="w-10 h-14 bg-red-600 rounded"
                  ></button>
                </div>
                <div className="ml-5">
                  <button
                    onClick={() => offSides(data.id, data.team_id)}
                    className="w-10 h-14 bg-gray-800 rounded text-white"
                  >
                    OS
                  </button>
                </div>
                <div className="flex items-center justify-center ml-5">
                  <button
                    onClick={() => switchPlayerHome(index, data.id)}
                    className="text-slate-500 hover:text-slate-800 transition-colors text-4xl"
                  >
                    <MdSwapVert className="text-white" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="team w-1/2 mt-10">
            {playerAway.map((data, index) => (
              <div key={data.numberJersey} className="flex justify-end">
                <div className="flex items-center justify-center mr-5">
                  <button
                    onClick={() => switchPlayerAway(index, data.id)}
                    className="text-slate-500 hover:text-slate-800 transition-colors text-4xl"
                  >
                    <MdSwapVert className="text-white" />
                  </button>
                </div>
                <div className="mr-5">
                  <button
                    onClick={() => offSides(data.id, data.team_id)}
                    className="w-10 h-14 bg-gray-800 rounded text-white"
                  >
                    OS
                  </button>
                </div>
                <div className="mr-5">
                  <button
                    onClick={() => redCard(data.id, data.name)}
                    className="w-10 h-14 bg-red-600 rounded"
                  ></button>
                </div>
                <div className="mr-5">
                  <button
                    onClick={() => yellowCard(data.id, data.name)}
                    className="w-10 h-14 bg-yellow-300 rounded"
                  ></button>
                </div>
                <h3 className="w-[4.5rem] -mr-4 pr-4 -z-[1] h-14 flex items-center justify-center text-slate-100 bg-slate-600 rounded">
                  {data.position}
                </h3>
                <h3 className="flex items-center bg-slate-700 text-slate-100 rounded-l-xl justify-end pr-8 -mr-4 h-14 px-4 w-56 capitalize">
                  {data.name}
                </h3>
                <button
                  onClick={() => goalButtonAway(data.id, data.team_id)}
                  className="text-slate-100 py-2 px-3 rounded z-[1] bg-slate-800 hover:bg-slate-900 w-14 h-14 flex justify-center items-center"
                >
                  {data.numberJersey}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5">
          {playerAway[0] || playerHome[0] ? (
            <h1 className="py-2 text-slate-100 font-semibold text-3xl text-center bg-slate-800 ">
              Pemain Pengganti
            </h1>
          ) : (
            ""
          )}
          <div className="flex justify-between">
            <div className="team w-1/2 mt-10 ">
              {playerHomeCadangan.map((data) => (
                <div key={data.numberJersey} className="flex">
                  <button className="text-slate-100 py-2 px-3 rounded z-[1] bg-slate-800 hover:bg-slate-900 w-14 h-14 flex justify-center items-center">
                    {data.numberJersey}
                  </button>
                  <h3 className="flex items-center bg-slate-700 text-slate-100 rounded-r-xl -ml-4 h-14 pl-8 w-56 capitalize">
                    {data.name}
                  </h3>
                  <h3 className="w-[4.5rem] -z-[1] h-14 flex -ml-4 pl-4 items-center justify-center text-slate-100 bg-slate-600 rounded">
                    {data.position}
                  </h3>
                  <div className="ml-5">
                    <button className="w-10 h-14 bg-yellow-300 hover:bg-yellow-400 rounded transition-colors"></button>
                  </div>
                  <div className="ml-5">
                    <button className="w-10 h-14 bg-red-600 hover:bg-red-700 rounded transition-colors"></button>
                  </div>
                  <div className="ml-5">
                    <button
                      onClick={() => offSides(data.id, data.team_id)}
                      className="w-10 h-14 bg-gray-800 rounded text-white"
                    >
                      OS
                    </button>
                  </div>
                  <div className="flex items-center justify-center ml-5">
                    <button className="text-slate-500 hover:text-slate-800 transition-colors text-4xl">
                      <MdSwapVert className="text-white" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className=" w-1/2 mt-10">
              {playerAwayCadangan.map((data) => (
                <div key={data.numberJersey} className="flex justify-end">
                  <div className="flex items-center justify-center mr-5">
                    <button className="text-slate-500 hover:text-slate-800 transition-colors text-4xl">
                      <MdSwapVert className="text-white" />
                    </button>
                  </div>
                  <div className="mr-5">
                    <button
                      onClick={() => offSides(data.id, data.team_id)}
                      className="w-10 h-14 bg-gray-800 rounded text-white"
                    >
                      OS
                    </button>
                  </div>
                  <div className="mr-5">
                    <button className="w-10 h-14 bg-red-600 hover:bg-red-700 rounded transition-colors"></button>
                  </div>
                  <div className="mr-5">
                    <button className="w-10 h-14 bg-yellow-300 hover:bg-yellow-400 rounded transition-colors"></button>
                  </div>
                  <h3 className="w-[4.5rem] -mr-4 pr-4 z-[1] h-14 flex items-center justify-center text-slate-100 bg-slate-600 rounded">
                    {data.position}
                  </h3>
                  <h3 className="flex items-center bg-slate-700 text-slate-100 rounded-l-xl justify-end pr-8 -mr-4 h-14 px-4 w-56 capitalize">
                    {data.name}
                  </h3>
                  <button className="text-slate-100 py-2 px-3 rounded z-[1] bg-slate-800 hover:bg-slate-900 w-14 h-14 flex justify-center items-center">
                    {data.numberJersey}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Modal isVisible={openModal} onClose={() => setOpenModal(false)}>
          <h1 className="text-center text-3xl">Pemain Cadangan</h1>
          {change === "home" ? (
            <div className="p-10 flex justify-center flex-col gap-y-5">
              {playerHomeCadangan.map((data, index) => (
                <div key={data.numberJersey} className="flex justify-center">
                  <h2 className="text-slate-100 py-2 px-3 rounded z-[2] bg-slate-800 hover:bg-slate-900 w-14 h-14 flex justify-center items-center">
                    {data.numberJersey}
                  </h2>
                  <h3 className="flex items-center z-[1] bg-slate-700 text-slate-100 rounded-r-xl -ml-4 h-14 pl-8 w-56 capitalize">
                    {data.name}
                  </h3>
                  <h3 className="w-[4.5rem] z-[0] h-14 flex -ml-4 pl-4 items-center justify-center text-slate-100 bg-slate-600 rounded">
                    {data.position}
                  </h3>

                  <div className="flex items-center justify-center ml-5">
                    <button
                      onClick={() => submitSwitch(data.id, index, "home")}
                      className=" hover:text-slate-800 transition-colors text-4xl">
                      <MdSwapVert className="text-slate-800" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="">
              <div className="p-10 flex justify-center flex-col gap-y-5">
                {playerAwayCadangan.map((data, index) => (
                  <div key={data.numberJersey} className="flex justify-center">
                    <h2 className="text-slate-100 py-2 px-3 rounded z-[2] bg-slate-800 hover:bg-slate-900 w-14 h-14 flex justify-center items-center">
                      {data.numberJersey}
                    </h2>
                    <h3 className="flex items-center z-[1] bg-slate-700 text-slate-100 rounded-r-xl -ml-4 h-14 pl-8 w-56 capitalize">
                      {data.name}
                    </h3>
                    <h3 className="w-[4.5rem] z-[0] h-14 flex -ml-4 pl-4 items-center justify-center text-slate-100 bg-slate-600 rounded">
                      {data.position}
                    </h3>
                    <div className="flex items-center justify-center ml-5">
                      <button
                        onClick={() => submitSwitch(data.id, index, "away")}
                        className=" hover:text-slate-800 transition-colors text-4xl">
                        <MdSwapVert className="text-slate-800" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Modal>
      </main>
    </div>
  );
}
