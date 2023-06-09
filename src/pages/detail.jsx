import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { BsBoxArrowInUp, BsBoxArrowDown } from "react-icons/bs";
import { IoFootball } from "react-icons/io5";
import Background from "../components/background";
import { useDownloadExcel } from "react-export-table-to-excel";
import {
  PDFDownloadLink,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import axios from "../utils/axios";
import back from "../utils/back";

export default function Detail() {
  const tableRef = useRef(null);
  const today = new Date();
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  const formattedDate = today
    .toLocaleDateString("en-GB", options)
    .replace(/\//g, "-");

  const [offside, setOffside] = useState([0, 0]);
  const [dataMatch, setDataMatch] = useState([]);
  const [data, setData] = useState();
  const [player, setPlayer] = useState([]);
  const [playerAway, setPlayerAway] = useState([]);
  const [goalHome, setGoalHome] = useState();
  const [goalAway, setGoalAway] = useState();

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: `Play- ${formattedDate}`,
    sheet: `Play- ${formattedDate}`,
  });

  const scoreTeamAway = async (idMatch, idTeam) => {
    await axios
      .get("goal/" + idMatch + "/" + idTeam)
      .then((res) => {
        setGoalAway(res.data.data);
      })
      .catch();
  };
  const scoreTeamHome = async (idMatch, idTeam) => {
    await axios
      .get("goal/" + idMatch + "/" + idTeam)
      .then((res) => {
        setGoalHome(res.data.data);
      })
      .catch();
  };

  const onChangeHandle = async (payload) => {
    const data = payload.split(" ");
    console.log(data);

    await axios
      .get("match/" + data[0])
      .then((res) => {
        console.log(res.data);
        setData(res.data.data);

        setPlayer(res.data.data.home_team.player);
        setPlayerAway(res.data.data.away_team.player);

        scoreTeamHome(data[0], data[1]);
        scoreTeamAway(data[0], data[2]);

        axios.get("os/" + data[0] + "/" + data[1]).then((res) =>
          setOffside((prev) => {
            prev[0] = res.data.data;
            return prev;
          })
        );

        axios.get("os/" + data[0] + "/" + data[2]).then((res) =>
          setOffside((prev) => {
            prev[1] = res.data.data;
            return prev;
          })
        );
      })
      .catch((err) => {});
  };
  const getMatch = async () => {
    await axios.get("match").then((res) => {
      setDataMatch(res.data.data);
    });
  };

  useEffect(() => {
    getMatch();
  }, []);

  const styles = StyleSheet.create({
    page: {
      flexDirection: "row",
      backgroundColor: "#ffffff",
      justifyContent: "center",
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
    table: {
      marginBottom: 10,
      marginTop: 30,
      fontFamily: "Helvetica",
      fontSize: 10,
      width: "100%",
    },
    tableHeader: {
      backgroundColor: "#f0f0f0",
      fontWeight: "bold",
      width: "100%",
      padding: 5,
    },
    tableRow: {
      borderBottomWidth: 1,
      borderColor: "#f0f0f0",
      flexDirection: "row",
    },
    tableCell: {
      paddingHorizontal: 0,
      paddingVertical: 5,
      color: "#000000",
      textAlign: "center",
      width: "100%",
      alignSelf: "center",
    },
    tableHeaderText: {
      fontSize: 10,
      fontWeight: "bold",
      textAlign: "center",
    },
    imageContainer: {
      width: 75,
      height: 75,
      margin: 5,
      alignSelf: "center", // Align the images vertically centered
      marginHorizontal: 30,
    },
    image: {
      objectFit: "contain",
      width: "100%",
      height: "100%",
    },
    scoreContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 10,
    },
    scoreText: {
      fontSize: 20,
      fontWeight: "bold",
      marginHorizontal: 10,
    },
    dateContainer: {
      alignSelf: "center",
      marginBottom: 10,
    },
    dateText: {
      fontSize: 14,
      fontWeight: "bold",
    },
    teamText: {
      fontSize: 14,
      fontWeight: "bold",
    },
  });

  const MyDoc = ({ player, playerAway }) => (
    <Document>
      <Page size="A4">
        <View style={styles.section}>
          {/* Date */}
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{formattedDate}</Text>
          </View>

          <View style={styles.page}>
            <>
              <View style={styles.imageContainer}>
                <Image
                  style={styles.image}
                  src={data ? `${back}team/${data.home_team.logo}` : ""}
                />
              </View>
              <View style={styles.teamText}>
                <Text>{data ? data.home_team.name : ""}</Text>{" "}
              </View>
            </>

            <View>
              <Text>{offside[0]}</Text>
            </View>
            <View>
              <Text>
                {" "}
                {data
                  ? data.ballPossession[0]
                    ? Math.round(data.ballPossession[1].possession_time) + "%"
                    : "0"
                  : "0"}
              </Text>
            </View>

            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>{goalHome}</Text>
              <Text style={styles.scoreText}>-</Text>
              <Text style={styles.scoreText}>{goalAway}</Text>
            </View>

            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                src={data ? `${back}team/${data.away_team.logo}` : ""}
              />
            </View>
            <View style={styles.teamText}>
              {data ? data.away_team.name : ""}
            </View>
          </View>
          <View>
            <Text>{offside[1]}</Text>
          </View>
          <View>
            <Text>
              {data
                ? data.ballPossession[1]
                  ? Math.round(data.ballPossession[1].possession_time) + "%"
                  : "0"
                : "0"}
            </Text>
          </View>

          {/* Table */}
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={styles.tableHeaderText}>No</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableHeaderText}>Nama</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableHeaderText}>Nomor Jersey</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableHeaderText}>Posisi</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableHeaderText}>Team</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableHeaderText}>Goal</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableHeaderText}>K.Merah</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableHeaderText}>K.Kuning</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableHeaderText}>Pergantian</Text>
              </View>
            </View>
            {/* Table Body */}
            {player.map((data, index) => (
              <View style={styles.tableRow} key={index}>
                <View style={styles.tableCell}>
                  <Text>{index + 1}</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>{data.name}</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>{data.numberJersey}</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>{data.position}</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>{data.team.name}</Text>
                </View>
                <View style={styles.tableCell}>
                  {data.goals[0]
                    ? data.goals.map((data) => (
                        <Text className="pl-2 font-bold inline">
                          {data.goal_time}"
                          <IoFootball className="text-xl" />
                        </Text>
                      ))
                    : ""}
                </View>
                <View style={styles.tableCell}>
                  <Text>
                    {
                      data.cards.filter((card) => card.card_type === "red")
                        .length
                    }
                  </Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>
                    {
                      data.cards.filter((card) => card.card_type === "yellow")
                        .length
                    }
                  </Text>
                </View>
                <View style={styles.tableCell}>
                  {data.status}
                  {data.switchPlayerIn[0]
                    ? data.switchPlayerIn.map((data) => (
                        <Text className="pl-2 font-bold inline">
                          {data.switch_time}" In
                          <BsBoxArrowInUp className="text-xl text-green-500" />
                        </Text>
                      ))
                    : ""}

                  {data.switchPlayerOut[0]
                    ? data.switchPlayerOut.map((data) => (
                        <Text className="pl-2 font-bold inline">
                          {data.switch_time}" Out
                          <BsBoxArrowDown className="text-xl text-red-500" />
                        </Text>
                      ))
                    : ""}
                </View>
              </View>
            ))}

            {playerAway.map((data, index) => (
              <View style={styles.tableRow} key={index}>
                <View style={styles.tableCell}>
                  <Text>{index + 1}</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>{data.name}</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>{data.numberJersey}</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>{data.position}</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>{data.team.name}</Text>
                </View>
                <View style={styles.tableCell}>
                  {data.goals[0]
                    ? data.goals.map((data) => (
                        <Text className="pl-2 font-bold inline">
                          {data.goal_time}"
                          <IoFootball className="text-xl" />
                        </Text>
                      ))
                    : ""}
                </View>
                <View style={styles.tableCell}>
                  <Text>
                    {
                      data.cards.filter((card) => card.card_type === "red")
                        .length
                    }
                  </Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>
                    {
                      data.cards.filter((card) => card.card_type === "yellow")
                        .length
                    }
                  </Text>
                </View>
                <View style={styles.tableCell}>
                  {data.status}
                  {data.switchPlayerIn[0]
                    ? data.switchPlayerIn.map((data) => (
                        <Text className="pl-2 font-bold inline">
                          {data.switch_time}" In
                          <BsBoxArrowInUp size={20} />
                        </Text>
                      ))
                    : ""}

                  {data.switchPlayerOut[0]
                    ? data.switchPlayerOut.map((data) => (
                        <Text className="pl-2 font-bold inline">
                          {data.switch_time}" Out
                          <BsBoxArrowDown className="text-xl text-red-500" />
                        </Text>
                      ))
                    : ""}
                </View>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );

  return (
    <div>
      <Navbar />
      <Background />
      <main className="font-Poppins">
        <PDFDownloadLink
          document={
            <MyDoc
              player={player}
              playerAway={playerAway}
              dataMatch={dataMatch}
            />
          }
          fileName={`Play-${formattedDate}.pdf`}
          className="bg-red-500 text-slate-100 rounded-lg py-2 px-3 ml-2 hover:bg-red-800 transition-colors"
        >
          {({ blob, url, loading, error }) =>
            loading ? "Loading document..." : "Export to PDF"
          }
        </PDFDownloadLink>
        <button
          className="bg-green-500 text-slate-100 rounded-lg py-2 px-3 ml-4 mt-4 hover:bg-green-800 transition-colors shadow-md"
          onClick={onDownload}
        >
          Export to Excel
        </button>
        <form action="" className="mt-4 text-center">
          <div className="">
            <label
              htmlFor="match"
              className="block text-white text-3xl font-bold mb-2"
            >
              Detail Pertandingan
            </label>
            <select
              onChange={(e) => onChangeHandle(e.target.value)}
              name=""
              id="match"
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">---Pilih Pertandingan---</option>
              {dataMatch.map((data) => (
                <option
                  className="text-center"
                  value={`${data.id} ${data.home_team.id} ${data.away_team.id}`}
                >
                  <span>{data.home_team.name}------</span>
                  <span>{data.away_team.name}</span>
                </option>
              ))}
            </select>
          </div>
        </form>
        <div className="flex justify-around items-center px-10">
          <img
            src={data ? `${back}team/${data.home_team.logo}` : ""}
            alt="logo team kiri"
            className="w-36 h-36"
          />
          <div className="w-full max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden mt-6">
            <div className="flex justify-between bg-gray-200 text-gray-700 py-2 px-2">
              <div className="capitalize w-1/3 text-center text-2xl font-bold flex justify-center items-center">
                <span>{data ? data.home_team.name : "team kiri"}</span>
              </div>
              <div className="w-1/3 text-center text-5xl font-extrabold">
                <span>
                  {goalHome} - {goalAway}
                </span>
              </div>
              <div className="capitalize w-1/3 text-center text-2xl font-bold flex justify-center items-center">
                <span>{data ? data.away_team.name : "team kanan"}</span>
              </div>
            </div>
            <div className="flex justify-between py-3 px-2">
              <div className="w-1/3 text-center text-lg font-medium flex justify-center items-center">
                <span>{offside[0]}</span>
              </div>
              <div className="w-1/3 text-center text-xl font-semibold">
                <span>Off side</span>
              </div>
              <div className="w-1/3 text-center text-lg font-medium flex justify-center items-center">
                <span>{offside[1]}</span>
              </div>
            </div>
            <div className="flex justify-between py-3 px-2">
              <div className="w-1/3 text-center text-lg font-medium flex justify-center items-center">
                <span>
                  {data
                    ? data.ballPossession[0]
                      ? Math.round(data.ballPossession[0].possession_time) + "%"
                      : "0"
                    : "0"}
                </span>
              </div>
              <div className="w-1/3 text-center text-xl font-semibold">
                <span>Ball Possession</span>
              </div>
              <div className="w-1/3 text-center text-lg font-medium flex justify-center items-center">
                <span>
                  {data
                    ? data.ballPossession[1]
                      ? Math.round(data.ballPossession[1].possession_time) + "%"
                      : "0"
                    : "0"}
                </span>
              </div>
            </div>
          </div>
          <img
            src={data ? `${back}team/${data.away_team.logo}` : ""}
            alt="logo kanan"
            className="w-36 h-36"
          />
        </div>
        <div className="flex justify-center my-10">
          <table
            className="bg-white mt-5 border border-slate-400 w-[90%]"
            ref={tableRef}
          >
            <thead className="text-lg">
              <th className="p-2 border border-slate-300">No</th>
              <th className="p-2 border border-slate-300">Nama</th>
              <th className="p-2 border border-slate-300">Nomor Jersey</th>
              <th className="p-2 border border-slate-300">Posisi</th>
              <th className="p-2 border border-slate-300">Team</th>
              <th className="p-2 border border-slate-300">Kartu Merah</th>
              <th className="p-2 border border-slate-300">Kartu Kuning</th>
              <th className="p-2 border border-slate-300">Status</th>
            </thead>
            <tbody className="text-center">
              {player.map((data, index) => (
                <tr>
                  <td className="p-2 border border-slate-300">{index + 1}</td>
                  <td className="p-2 border border-slate-300">{data.name}</td>
                  <td className="p-2 border border-slate-300">
                    {data.numberJersey}
                    {data.goals[0]
                      ? data.goals.map((data) => (
                          <span className="pl-2 font-bold inline">
                            {data.goal_time}"
                            <IoFootball className="text-xl" />
                          </span>
                        ))
                      : ""}
                  </td>
                  <td className="p-2 border border-slate-300">
                    {data.position}
                  </td>
                  <td className="p-2 border border-slate-300">
                    {data.team.name}
                  </td>
                  <td className="p-2 border border-slate-300">
                    {
                      data.cards.filter((card) => card.card_type === "red")
                        .length
                    }
                  </td>
                  <td className="p-2 border border-slate-300">
                    {
                      data.cards.filter((card) => card.card_type === "yellow")
                        .length
                    }
                  </td>
                  <td className="p-2 border border-slate-300">
                    {data.status}

                    {data.switchPlayerIn[0]
                      ? data.switchPlayerIn.map((data) => (
                          <span className="pl-2 font-bold inline">
                            {data.switch_time}"
                            <BsBoxArrowInUp className="text-xl text-green-500" />
                          </span>
                        ))
                      : ""}

                    {data.switchPlayerOut[0]
                      ? data.switchPlayerOut.map((data) => (
                          <span className="pl-2 font-bold inline">
                            {data.switch_time}"
                            <BsBoxArrowDown className="text-xl text-red-500" />
                          </span>
                        ))
                      : ""}
                  </td>
                </tr>
              ))}
              {playerAway.map((data, index) => (
                <tr>
                  <td className="p-2 border border-slate-300">{index + 1}</td>
                  <td className="p-2 border border-slate-300">{data.name}</td>
                  <td className="p-2 border border-slate-300">
                    {data.numberJersey}
                    {data.goals[0]
                      ? data.goals.map((data) => (
                          <span className="pl-2 font-bold inline">
                            {data.goal_time}"
                            <IoFootball className="text-xl" />
                          </span>
                        ))
                      : ""}
                  </td>
                  <td className="p-2 border border-slate-300">
                    {data.position}
                  </td>
                  <td className="p-2 border border-slate-300">
                    {data.team.name}
                  </td>
                  <td className="p-2 border border-slate-300">
                    {
                      data.cards.filter((card) => card.card_type === "red")
                        .length
                    }
                  </td>
                  <td className="p-2 border border-slate-300">
                    {
                      data.cards.filter((card) => card.card_type === "yellow")
                        .length
                    }
                  </td>
                  <td className="p-2 border border-slate-300">
                    {data.status}
                    {data.switchPlayerIn[0]
                      ? data.switchPlayerIn.map((data) => (
                          <span className="pl-2 font-bold inline">
                            {data.switch_time}"
                            <BsBoxArrowInUp className="text-xl text-green-500" />
                          </span>
                        ))
                      : ""}

                    {data.switchPlayerOut[0]
                      ? data.switchPlayerOut.map((data) => (
                          <span className="pl-2 font-bold inline">
                            {data.switch_time}"
                            <BsBoxArrowDown className="text-xl text-red-500" />
                          </span>
                        ))
                      : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
