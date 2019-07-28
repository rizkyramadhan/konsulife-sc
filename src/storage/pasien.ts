import { observable } from "mobx";

export const pasien = observable({
  session: {
    id: 0,
    date: "",
    time: "",
    psikolog: 0,
    package: 0
  },
  package: [
    {
      id: 1,
      title: "VVIP+",
      description:
        "Anda dapat berkonsultasi dengan dokter psikolog terbaik kami melalui panggilan suara tanpa gangguan.",
      duration: 90,
      channel: "call",
      price: "500.000"
    },
    {
      id: 2,
      title: "VVIP",
      description:
        "Anda dapat berkonsultasi dengan dokter psikolog terbaik kami melalui pesan chat pribadi.",
      duration: 90,
      channel: "chat",
      price: "400.000"
    },
    {
      id: 3,
      title: "VIP+",
      description:
        "Anda dapat berkonsultasi dengan dokter psikolog terbaik kami melalui panggilan suara tanpa gangguan.",
      duration: 50,
      channel: "call",
      price: "350.000"
    },
    {
      id: 4,
      title: "VIP",
      description:
        "Anda dapat berkonsultasi dengan dokter psikolog terbaik kami melalui pesan chat pribadi.",
      duration: 50,
      channel: "chat",
      price: "250.000"
    }
  ],
  psikolog: [
    {
      id: 1,
      nama: "Elista Sandy",
      kota: "Jakarta",
      klien: 20,
      rating: 4,
      studi: "UNAIR psikologi 2014",
      exp: "5 tahun"
    },
    {
      id: 2,
      nama: "Elista Sandy",
      kota: "Jakarta",
      klien: 20,
      rating: 4,
      studi: "UNAIR psikologi 2014",
      exp: "5 tahun"
    },
    {
      id: 3,
      nama: "Elista Sandy",
      kota: "Jakarta",
      klien: 20,
      rating: 4,
      studi: "UNAIR psikologi 2014",
      exp: "5 tahun"
    },
    {
      id: 4,
      nama: "Elista Sandy",
      kota: "Jakarta",
      klien: 20,
      rating: 4,
      studi: "UNAIR psikologi 2014",
      exp: "5 tahun"
    },
    {
      id: 5,
      nama: "Elista Sandy",
      kota: "Jakarta",
      klien: 20,
      rating: 4,
      studi: "UNAIR psikologi 2014",
      exp: "5 tahun"
    },
    {
      id: 6,
      nama: "Elista Sandy",
      kota: "Jakarta",
      klien: 20,
      rating: 4,
      studi: "UNAIR psikologi 2014",
      exp: "5 tahun"
    },
    {
      id: 7,
      nama: "Elista Sandy",
      kota: "Jakarta",
      klien: 20,
      rating: 4,
      studi: "UNAIR psikologi 2014",
      exp: "5 tahun"
    },
    {
      id: 8,
      nama: "Elista Sandy",
      kota: "Jakarta",
      klien: 20,
      rating: 4,
      studi: "UNAIR psikologi 2014",
      exp: "5 tahun"
    },
    {
      id: 9,
      nama: "Elista Sandy",
      kota: "Jakarta",
      klien: 20,
      rating: 4,
      studi: "UNAIR psikologi 2014",
      exp: "5 tahun"
    },
    {
      id: 10,
      nama: "Elista Sandy",
      kota: "Jakarta",
      klien: 20,
      rating: 4,
      studi: "UNAIR psikologi 2014",
      exp: "5 tahun"
    },
    {
      id: 11,
      nama: "Elista Sandy",
      kota: "Jakarta",
      klien: 20,
      rating: 4,
      studi: "UNAIR psikologi 2014",
      exp: "5 tahun"
    },
    {
      id: 12,
      nama: "Elista Sandy",
      kota: "Jakarta",
      klien: 20,
      rating: 4,
      studi: "UNAIR psikologi 2014",
      exp: "5 tahun"
    },
    {
      id: 13,
      nama: "Elista Sandy",
      kota: "Jakarta",
      klien: 20,
      rating: 4,
      studi: "UNAIR psikologi 2014",
      exp: "5 tahun"
    }
  ],
  schedule: [
    {
      id: 1,
      time: "09.00"
    },
    {
      id: 2,
      time: "09.30"
    },
    {
      id: 3,
      time: "10.00"
    },
    {
      id: 4,
      time: "10.30"
    }
  ]
});
