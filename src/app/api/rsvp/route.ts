export async function POST() {
  return Response.json(
    {
      saved: false,
      message: "Private RSVP storage is not configured. No guest information was received or saved.",
    },
    {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
