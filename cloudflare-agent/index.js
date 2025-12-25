export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // CORS Headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, cf-aig-authorization",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Health / Status Endpoint
    if (url.pathname === "/health" || url.pathname === "/") {
      return new Response(JSON.stringify({
        status: "Atomic Core Online",
        energy_level: "100%",
        message: "Astro Hero Backend Agent is operational.",
        timestamp: new Date().toISOString()
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    // Compatibility with existing frontend /api/chat
    if (url.pathname === "/api/chat") {
      try {
        const body = await request.json();
        const userMessage = body.message || body.prompt;

        if (!userMessage) {
          return new Response(JSON.stringify({ error: "Message is required" }), {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }

        const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${env.MISTRAL_API_KEY}`,
          },
          body: JSON.stringify({
            model: env.MISTRAL_MODEL || "mistral-medium-latest",
            messages: [{ role: "user", content: userMessage }]
          }),
        });

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || "I am processing your request with atomic energy!";

        return new Response(JSON.stringify({
          reply: reply,
          status: "Success",
          hero_core: "Atomic-v3"
        }), {
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });

      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
    }

    // Proxy AI Requests (OpenAI-compatible format)
    if (url.pathname.includes("/v1/chat/completions") || url.pathname.includes("/mistral/chat/completions")) {
      const authHeader = request.headers.get("cf-aig-authorization") || request.headers.get("Authorization");

      // Basic security check if a token is configured (optional but recommended)
      // if (authHeader !== `Bearer ${env.CF_AIG_TOKEN}`) { ... }

      try {
        const body = await request.json();

        // Default to Mistral if no provider specified or if path implies it
        const isMistral = url.pathname.includes("/mistral") || !body.model?.includes("gpt");

        let targetUrl = "https://api.mistral.ai/v1/chat/completions";
        let apiKey = env.MISTRAL_API_KEY;

        if (!isMistral && env.OPENAI_API_KEY) {
          targetUrl = "https://api.openai.com/v1/chat/completions";
          apiKey = env.OPENAI_API_KEY;
        }

        const response = await fetch(targetUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            ...body,
            model: body.model || env.MISTRAL_MODEL || env.AGENT_ID || "mistral-medium-latest"
          }),
        });

        const data = await response.json();

        // Add "Heroic" flair to the response
        if (data.choices && data.choices[0] && data.choices[0].message) {
          data.hero_telemetry = {
            processing_core: "Atomic-v3",
            efficiency_gain: "14.2%",
            status: "Success"
          };
        }

        return new Response(JSON.stringify(data), {
          status: response.status,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });

      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
    }

    return new Response("Not Found", { status: 404 });
  }
};
