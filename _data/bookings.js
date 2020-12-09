const bookings = [
  {
    _id: "5fcf5a693eec6c21244376f9",
    user: "5d7a514b5d2c12c7449be044",
    tutor: "5d7a514b5d2c12c7449be043",
    subject: "5d725cb9c4ded7bcb480eaa1",
    date: "2020-12-09",
    status: "accepted",
    address: "NYSC Camp Kubwa Abuja",
    amount: 2000,
    isPaid: true,
    paidAt: "2020-12-09",
    paymentResult: {
      id: "5fcf5a693eec6c2124437703",
      status: "success",
      update_time: "2020-12-09",
      email_address: "user@gmail.com"
    }
  },
  {
    _id: "5fcf5a693eec6c21244376fa",
    user: "5c8a1d5b0190b214360dc033",
    tutor: "5d7a514b5d2c12c7449be045",
    subject: "5d725ce8c4ded7bcb480eaa3",
    date: "2020-12-10",
    amount: 2500,
    status: "finished",
    address: "Zuba Abuja",
    isPaid: true,
    paidAt: "2020-12-10",
    paymentResult: {
      id: "5fcf5a693eec6c2124437704",
      status: "success",
      update_time: "2020-12-10",
      email_address: "chiamaola@gmail.com"
    }
  },
  {
    _id: "5fcf5a693eec6c21244376fb",
    user: "5c8a1d5b0190b214360dc034",
    tutor: "5d7a514b5d2c12c7449be046",
    subject: "5d725a4a7b292f5f8ceff789",
    amount: 3000,
    date: "2020-12-10",
    status: "canceled",
    address: "Central Business District Garki Abuja",
    isPaid: false
  },
  {
    _id: "5fcf5a693eec6c21244376fc",
    user: "5c8a1d5b0190b214360dc035",
    tutor: "5c8a1d5b0190b214360dc031",
    subject: "5d725cb9c4ded7bcb480eaa1",
    date: "2020-12-11",
    status: "rejected",
    address: "Galadima Abuja",
    amount: 3000,
    isPaid: true,
    paidAt: "2020-12-12",
    paymentResult: {
      id: "5fcf5a693eec6c2124437706",
      status: "success",
      update_time: "2020-12-12",
      email_address: "chinyoke@gmail.com"
    }
  },
  {
    _id: "5fcf5a693eec6c21244376fd",
    user: "5c8a1d5b0190b214360dc036",
    tutor: "5c8a1d5b0190b214360dc032",
    subject: "5d725ce8c4ded7bcb480eaa3",
    amount: 3000,
    date: "2020-12-13",
    status: "pending",
    address: "Mabushi Abuja",
    isPaid: false,
    paidAt: "2020-12-13",
    paymentResult: {
      id: "5fcf5a693eec6c2124437707",
      status: "failed",
      update_time: "2020-12-13",
      email_address: "simisoeji@gmail.com"
    }
  },
  {
    _id: "5fcf5a693eec6c21244376fe",
    user: "5c8a1d5b0190b214360dc037",
    tutor: "5d7a514b5d2c12c7449be043",
    subject: "5d725cd2c4ded7bcb480eaa2",
    amount: 2000,
    date: "2020-12-14",
    status: "canceled",
    address: "Wuse Abuja",
    isPaid: false
  },
  {
    _id: "5fcf5a693eec6c21244376ff",
    user: "5c8a1d5b0190b214360dc038",
    tutor: "5d7a514b5d2c12c7449be045",
    subject: "5d725cd2c4ded7bcb480eaa2",
    amount: 2500,
    date: "2020-12-15",
    status: "canceled",
    address: "Abaji, Abuja",
    isPaid: false
  },
  {
    _id: "5fcf5a693eec6c2124437700",
    user: "5c8a1d5b0190b214360dc039",
    tutor: "5d7a514b5d2c12c7449be046",
    subject: "5d725c84c4ded7bcb480eaa0",
    amount: 2000,
    date: "2020-12-16",
    status: "accepted",
    address: "Aminu Kano Crescent Abuja",
    isPaid: true,
    paidAt: "2020-12-16",
    paymentResult: {
      id: "5fcf5a693eec6c212443770a",
      status: "success",
      update_time: "2020-12-16",
      email_address: "aminucgbe@gmail.com"
    }
  },
  {
    _id: "5fcf5a693eec6c2124437701",
    user: "5c8a1d5b0190b214360dc040",
    tutor: "5c8a1d5b0190b214360dc031",
    subject: "5d725cd2c4ded7bcb480eaa2",
    amount: 2500,
    date: "2020-12-17",
    status: "accepted",
    address: "1012 Sani Abacha Way, Central Business District, Abuja",
    isPaid: true,
    paidAt: "2020-12-17",
    paymentResult: {
      id: "5fcf5a693eec6c212443770b",
      status: "success",
      update_time: "2020-12-17",
      email_address: "lolaolwa@gmail.com"
    }
  },
  {
    _id: "5fcf5a693eec6c2124437702",
    user: "5c8a1d5b0190b214360dc040",
    tutor: "5c8a1d5b0190b214360dc032",
    subject: "5d725a4a7b292f5f8ceff789",
    amount: 3000,
    date: "2020-12-29",
    status: "pending",
    address: "1012 Sani Abacha Way, Central Business District, Abuja",
    isPaid: true,
    paidAt: "2020-12-18",
    paymentResult: {
      id: "5fcf5a693eec6c212443770c",
      status: "success",
      update_time: "2020-12-18",
      email_address: "lolaolwa@gmail.com"
    }
  }
];

export default bookings;