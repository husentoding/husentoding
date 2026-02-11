// Configuration for the Valentine's website
// Edit these values to customize your experience

export const config = {
  // The name to show in the login prompt
  partnerName: "Fadila",
  
  // The secret password (something only they would know)
  secretPassword: "serumpun",
  
  // Delay in seconds before showing the invitation (after entering gallery)
  invitationDelay: 1,

  // Minimum time to show the loading screen after successful login
  minLoadingSeconds: 5,

  // Max time to wait for assets preloading before allowing continue
  assetPreloadTimeoutSeconds: 15,
  
  // Date invitation details
  invitation: {
    date: "February 14th, 2026",
    message: "Not something I'm used to, but still very excited to spend it with you <3",
    notes: "Kalau ada yg kurang, do let me know yah sayang",
    plan: [
      {
        time: "11:00",
        title: "Kondangan Date",
        venue: "Wedding venue temen kamuu",
        address: "Somewhere in Tangerang wkkw",
        dresscode: "Formal Beige and Black",
        mapsUrl: "",
      },
      {
        time: "14:00",
        title: "Massage Time!",
        venue: "Senja Massage and Reflexology",
        address: "Alam Sutera",
        dresscode: "Casual",
        mapsUrl: "https://maps.app.goo.gl/nhcDKuc2ZxnZvCKN9",
      },
      {
        time: "17:00",
        title: "Coffe/Matcha",
        venue: "Kurasu Kissaten",
        address: "Blok M",
        dresscode: "Casual",
        mapsUrl: "https://maps.app.goo.gl/RoetpbNTLmdjSn4p9",
      },
      {
        time: "20:00 PM",
        title: "Dinner",
        venue: "Toku Gunawarman",
        address: "Gunawarman No.39, Jakarta",
        dresscode: "Casual Black and Beige",
        mapsUrl: "https://maps.app.goo.gl/383fYgsJvdw9Y9TE8",
      },
    ],
  }
}
