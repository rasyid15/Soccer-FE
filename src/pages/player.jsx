import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import axios from "../utils/axios";
import swal from "sweetalert";
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

export default function Player() {
  const [modalOpen, setModalOpen] = useState(false);
  const [player, setPlayer] = useState([]);
  const [team, setTeam] = useState([]);
  const [nama, setNama] = useState("");
  const [jersey, setJersey] = useState("");
  const [posisi, setPosisi] = useState("");
  const [status, setStatus] = useState("main");
  const [teamId, setTeamId] = useState();

  const getTeam = async () => {
    const res = await axios.get("team/");
    setTeam(res.data.data);
  };

  const getAll = async () => {
    const res = await axios.get("player/");
    setPlayer(res.data.data);
  };

  const onSubmit = async (e) => {
    const data = {
      name: nama,
      numberJersey: jersey,
      position: posisi,
      status: status,
      team_id: teamId,
    };
    console.log(data);
    e.preventDefault();
    await axios.post("player/add", data).then((res) => {
      console.log(res);
      if (res.status === 201) {
        getAll();
        setModalOpen(false);
        setJersey();
        setNama();
        setPosisi();
        setTeamId();
      }
    }).catch(err => {
      console.log(err)
      swal({
        title: err.response.data.msg,
        icon: "warning"
      })
    })
  };

  const handleAdd = () => {
    getTeam();
    setModalOpen(true);
  };

  const onDelete = (id) => {
    swal({
      title: "Yakin Delete?",
      icon: "warning",
      buttons: {
        cancel: "No",
        Ok: true,
      },
    }).then(async (result) => {
      if (result === "Ok") {
        await axios.delete("player/del/" + id);
        getAll();
      }
    });
  };
  useEffect(() => {
    getAll();
  }, []);

  const today = new Date();
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  const formattedDate = today
    .toLocaleDateString("en-GB", options)
    .replace(/\//g, "-");

  const tableRef = useRef(null);

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: `Play-${formattedDate}.xlsx`,
    sheet: `Play-${formattedDate}.xlsx`,
  });

  const styles = StyleSheet.create({
    page: {
      flexDirection: "row",
      backgroundColor: "#ffffff",
      justifyContent: "space-between", // Add this line to align the date and images
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
    table: {
      marginBottom: 10,
      marginTop:30,
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
      paddingHorizontal: 25,
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
      marginHorizontal:30,
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
      fontSize: 16,
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
  });

  const MyDoc = ({ player }) => (
    <Document>
      <Page size="A4">
        <View style={styles.section}>
          {/* Date */}
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>Tanggal Permainan</Text>
          </View>

          <View style={styles.page}>
            {/* Image 1 */}
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                src={`${process.env.PUBLIC_URL}/profile.png`}
              />
            </View>

            {/* Score */}
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>Score</Text>
              <Text style={styles.scoreText}>-</Text>
              <Text style={styles.scoreText}>Score</Text>
            </View>

            {/* Image 2 */}
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                src={`${process.env.PUBLIC_URL}/profile.png`}
              />
            </View>
          </View>

          {/* Table */}
          <View style={styles.table}>
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
                </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );

  return (
    <div className="">
      <Navbar />
      <Background />
      <main className="font-Poppins mt-5">
        <button
          onClick={handleAdd}
          className="ml-5 bg-blue-600 text-slate-100 py-2 px-3 rounded-lg hover:bg-blue-800 transition-colors "
        >
          Tambah Player
        </button>
        <PDFDownloadLink
          document={<MyDoc player={player} />}
          fileName={`Play-${formattedDate}.pdf`}
          className="bg-red-500 text-slate-100 rounded-lg py-2 px-3 ml-2 hover:bg-red-800 transition-colors"
        >
          {({ blob, url, loading, error }) =>
            loading ? "Loading document..." : "Export to PDF"
          }
        </PDFDownloadLink>
        <button
          className="bg-green-500 text-slate-100 rounded-lg py-2 px-3 ml-2 hover:bg-green-800 transition-colors"
          onClick={onDownload}
        >
          Export to Excel
        </button>
        <div className="flex justify-center">
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
              <th className="p-2 border border-slate-300">Action</th>
            </thead>
            <tbody className="text-center">
              {player.map((data, index) => (
                <tr>
                  <td className="p-2 border border-slate-300">{index + 1}</td>
                  <td className="p-2 border border-slate-300">{data.name}</td>
                  <td className="p-2 border border-slate-300">
                    {data.numberJersey}
                  </td>
                  <td className="p-2 border border-slate-300">
                    {data.position}
                  </td>
                  <td className="p-2 border border-slate-300">
                    {data.team.name}
                  </td>
                  <td className="p-2 border border-slate-300 ">
                    <button
                      onClick={() => onDelete(data.id)}
                      className="bg-red-500 py-2 px-3 rounded-lg hover:bg-red-600 transition-colors text-slate-100"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Modal
          onClose={() => {
            setJersey();
            setNama();
            setPosisi();
            setTeamId();
            setModalOpen(false);
          }}
          isVisible={modalOpen}
        >
          <form onSubmit={(e) => onSubmit(e)} className="p-10">
            <div className="mb-4">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="username"
              >
                Nama Player
              </label>
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Nama Player"
                required
                value={nama}
                onChange={(e) => setNama(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="username"
              >
                Nomor Jersey
              </label>
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="1234"
                required
                value={jersey}
                onChange={(e) => setJersey(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="username"
              >
                Position
              </label>
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Nama Team"
                required
                value={posisi}
                onChange={(e) => setPosisi(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="username"
              >
                Team
              </label>
              <select
                name=""
                id=""
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={(e) => setTeamId(e.target.value)}
              >
                <option value="" className="text-center">
                  ---Pilih Team---
                </option>
                {team.map((data) => (
                  <option value={data.id}>{data.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="status"
              >
                Status
              </label>
              <select name="" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="status"
                value={status}
                onChange={e => setStatus(e.target.value)}>
                <option value="main">pemain utama</option>
                <option value="cadangan">cadangan</option>
              </select>
            </div>
            <button
              className="bg-blue-600 text-slate-100 py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors "
              type="submit"
            >
              Submit
            </button>
          </form>
        </Modal>
      </main>
    </div>
  );
}
