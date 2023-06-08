import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import axios from "../utils/axios";
import swal from "sweetalert";
import Background from "../components/background";

export default function Team() {
  const [modalOpen, setModalOpen] = useState(false);
  const [team, setTeam] = useState([]);
  const [nama, setNama] = useState("");
  const [img, setImg] = useState([]);

  const getAll = async () => {
    const res = await axios.get("/team/");
    setTeam(res.data.data);
  };

useEffect(() => {
  console.log(img);
}, [img])

  const onSubmit = async (e) => {

    const data = new FormData()
    data.append("name", nama)
    data.append("logo", img)
    console.log(data);
    e.preventDefault();
    await axios.post("team/add", data, {}).then((res) => {
      console.log(res);
      if (res.status === 201) {
        getAll();
        setModalOpen(false);
      }
      else {
        swal({
          title: res.data.msg,
          icon: "warning"
        })
      }
    }).catch(err => {
      console.log(err);
      swal({
        title: err.msg,
        icon: "warning"
      })
    })
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
        await axios.delete("team/del/" + id)
        .catch((err) => {
          console.log(err);
          swal({
            title: "error!! cant delete",
            icon: "warning"
          })
        })
        getAll();
      }
    })
    
  };
  useEffect(() => {
    getAll();
  }, []);
  return (
    <div>
      <Navbar />
      <Background />
      <main className="font-Poppins mt-5 w-screen">
        <button
          onClick={() => setModalOpen(true)}
          className="ml-5 bg-blue-600 text-slate-100 py-2 px-3 rounded-lg hover:bg-blue-800 transition-colors "
        >
          Tambah Team
        </button>
        <div className="flex justify-center ">
          <table className="bg-white mt-5 border border-slate-400 w-[90%]">
            <thead>
              <tr>
                <th className="p-2 border border-slate-400">No</th>
                <th className="p-2 border border-slate-400">Team</th>
                <th className="p-0 border border-slate-400">
                  <th className="p-2  w-1/2 ">Nama</th>
                  <th className="p-2 border-x border-slate-400 w-1/2">Nomor Jersey</th>
                  <th className="p-2  w-1/2 ">Position</th>
                </th>
                <th className="p-2 border border-slate-400">Action</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {team.map((data, index) => (
                <tr>
                  <td className="p-2 border border-slate-300">{index + 1}</td>
                  <td className="p-2 border border-slate-300">{data.name}</td>
                  <td className="p-0 border border-slate-300">
                    {data.player.map((playerData, playerIndex) => (
                      <div className="m-0" key={playerIndex}>
                        <td className="p-2 border border-slate-300 w-1/2">
                          {playerData.name}
                        </td>
                        <td className="p-2 border border-slate-300 w-1/2">
                          {playerData.numberJersey}
                        </td>
                        <td className="p-2 border border-slate-300 w-1/2">
                          {playerData.position}
                        </td>
                      </div>
                    ))}
                  </td>
                  <td className="p-2 border border-slate-300">
                    <button
                      onClick={() => onDelete(data.id)}
                      className="bg-red-500 py-2 px-3 rounded-lg text-slate-100 hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Modal onClose={() => {
          setImg(null)
          setNama("")
          setModalOpen(false)}} isVisible={modalOpen}>
          <form onSubmit={(e) => onSubmit(e)} className="p-10" >
            <div className="mb-6">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="username"
              >
                Nama Team
              </label>
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Nama Team"
                required
                value={nama}
                onChange={(e) => setNama(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="file"
              >
                Logo Team
              </label>
              <input
                type="file"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="file"
                required
                accept="image/png, image/jpg, image/jpeg"

                onChange={(e) => {
                  setImg(e.target.files[0])
                  console.log(e.target.files);
                  console.log(e.target.files[0]);
                  console.log(img);
                }}
              />
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
