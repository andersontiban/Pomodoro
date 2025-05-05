// app/api/youtube/route.js
export async function POST(req) {
    const { query } = await req.json()
  
    const apiKey = process.env.YOUTUBE_API_KEY
  
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(query)}&key=${apiKey}`
  
    try {
      const response = await fetch(url)
      const data = await response.json()
  
      if (!response.ok) {
        return new Response(JSON.stringify({ error: data.error.message }), { status: response.status })
      }
  
      const videoId = data.items?.[0]?.id?.videoId || null
      return Response.json({ videoId })
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to fetch YouTube video.' }), { status: 500 })
    }
  }
  