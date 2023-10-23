import axios from 'axios';
// Remove these lines
import Link from 'next/link';
import styled from 'styled-components'; // Import styled-components


import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import moment from 'moment';

export default function Struk() {
  const router = useRouter();
  const { id } = router.query;
  const [pemesanan, setPemesanan] = useState([]);

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:8080/pemesanan/find/` + id, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        })
        .then((res) => {
          console.log(res.data.data);
          setPemesanan(res.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [id]);
    
        const arrPrice = pemesanan?.map((item) => {
        return item.harga;
        });
    
        console.log(arrPrice);
    
        const totalPrice = arrPrice.reduce((acc, currentVal) => acc + currentVal, 0);
    
        console.log(totalPrice);
    
        const formatStartDt = moment(pemesanan[0]?.tgl_check_in).format("YYYY-MM-DD");
        const formatEndDt = moment(pemesanan[0]?.tgl_check_out).format("YYYY-MM-DD");
    
        const startDate = moment(formatStartDt);
        const endDate = moment(formatEndDt);
        const longStay = moment.duration(endDate.diff(startDate)).asDays();
    
        function handlePrint() {
            window.print();
        
            // Check if the printing was successful (You may need to implement your own success condition)
            var printingSuccessful = true; // Replace this with your actual success condition
        
            if (printingSuccessful) {
                // Redirect to the desired page on success
                window.location.href = '/pagescustomer/history';
            }
        }
    
        return (
        <div className="flex flex-col p-8 stroke-box m-auto  border-2 mt-10 w-11/12">
            <div className="mt-4  stroke-form">
            <h1 className="text-xl font-semibold border-b-2 mb-4">Rincian Pemesanan</h1>
            </div>
    
            <div className="flex flex-col w-full bg-slate-100 p-4 rounded-lg my-6">
            <div className="flex p-4 ml-6 w-full">
                <div className="flex flex-col w-1/2">
                <h1 className="text-sm text-gray">Nama Customer</h1>
                <p className="text-sm font-semibold mt-4">{pemesanan[0]?.nama_user}</p>
                </div>
                <div className="flex flex-col ml-96 w-1/2">
                <h1 className="text-sm text-gray">Nama Tamu</h1>
                <p className="text-sm font-semibold mt-4">
                    {pemesanan[0]?.nama_tamu}
                </p>
                </div>
            </div>
            {/* Lanjutan isi konten nota */}
            <div className="flex p-4 ml-6 w-full">
                <div className="flex flex-col w-1/2">
                <h1 className="text-sm text-gray">Email Pemesan</h1>
                <p className="text-sm font-semibold mt-4">{pemesanan[0]?.email_pemesanan}</p>
                </div>
                <div className="flex flex-col ml-96 w-1/2">
                <h1 className="text-sm text-gray">Tgl Pemesanan</h1>
                <p className="text-sm font-semibold mt-4">
                    {moment(pemesanan[0]?.tgl_pemesanan).format("YYYY-MMM-DD")}
                </p>
                </div>
            </div>
            <div className="flex p-4 ml-6 w-full">
                <div className="flex flex-col w-1/2">
                <h1 className="text-sm text-gray">Tgl Check In</h1>
                <p className="text-sm font-semibold mt-4">
                    {moment(pemesanan[0]?.tgl_check_in).format("YYYY-MMM-DD")}
                </p>
                </div>
                <div className="flex flex-col ml-96 w-1/2">
                <h1 className="text-sm text-gray">Tgl Check Out</h1>
                <p className="text-sm font-semibold mt-4">
                    {moment(pemesanan[0]?.tgl_check_out).format("YYYY-MMM-DD")}
                </p>
                </div>
            </div>
            <div className="flex p-4 ml-6 w-full">
                <div className="flex flex-col w-1/2">
                <h1 className="text-sm text-gray ">Jumlah Kamar</h1>
                <p className="text-sm font-semibold mt-4">
                    {pemesanan[0]?.jumlah_kamar} Kamar
                </p>
                </div>
                <div className="flex flex-col ml-96 w-1/2">
                <h1 className="text-sm text-gray">Tipe Kamar</h1>
                <p className="text-sm font-semibold mt-4">
                    {pemesanan[0]?.nama_tipe_kamar}
                </p>
                </div>
            </div>
            <div className="flex p-4 ml-6 w-full">
                <div className="flex flex-col w-1/2">
                <h1 className="text-sm text-gray">Lama Penginapan</h1>
                <p className="text-sm font-semibold mt-4">{longStay} Hari</p>
                </div>
                <div className="flex flex-col ml-96 w-1/2">
                <h1 className="text-sm text-gray ">Status Penginapan</h1>
                <p className="text-sm font-semibold mt-4">
                    {pemesanan[0]?.status_pemesanan}
                </p>
                </div>
            </div>
            <div className="flex flex-col ml-10 w-full">
                <h1 className="text-sm text-gray ">Nomor Kamar</h1>
                <div className="flex gap-1">
                {pemesanan?.map((item, index) => (
                    <>
                    <p className="text-sm font-semibold mt-1">{item.nomor_kamar}</p>
                    {index !== pemesanan.length - 1 && <span>,</span>}
                    </>
                ))}
                </div>
            </div>
            </div>
    
            <div className="flex flex-col py-4">
            <h1 className="text-sm">Total Harga</h1>
            <p className="text-xl mt-4 font-semibold">
                {totalPrice.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
                })}
            </p>
            </div>
    
            <div className="flex w-full mt-4">
            <Link
                href="../history"
                className="w-1/2 h-[52px] sm:flex justify-center items-center primary-text border-2 rounded-lg hidden-print mr-4"
            >
                kembali
            </Link>
            <button
                onClick={handlePrint}
                className="w-1/2 h-[52px] sm:flex justify-center items-center border-2 bg-neutral-950 text-white primary-bg rounded-lg hidden-print"
            >
                Cetak
            </button>
            </div>
    
      
        </div>
        );
    };