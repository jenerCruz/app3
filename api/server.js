// api/server.js
import express from "express";
import { spawn } from "child_process";

const app = express();
app.use(express.json());

// Middleware opcional para validar API key interna
app.use((req, res, next) => {
  const key = req.headers["x-api-key"];
    if (process.env.MY_AGENT_KEY && key !== process.env.MY_AGENT_KEY) {
        return res.status(403).json({ error: "Acceso denegado: API key inválida" });
          }
            next();
            });

            // Ruta de bienvenida
            app.get("/", (req, res) => {
              res.send("✅ API Custom Agent corriendo. Usa POST /predict para interactuar.");
              });

              // Endpoint principal para el agente
              app.post("/predict", (req, res) => {
                const input = req.body.text || "";

                  // Llamamos al script Python del agente
                    const py = spawn("python3", ["agent/agent.py", input]);

                      let data = "";
                        py.stdout.on("data", chunk => {
                            data += chunk.toString();
                              });

                                py.on("close", () => {
                                    res.json({ result: data.trim() });
                                      });

                                        py.stderr.on("data", err => {
                                            console.error("Error en agente:", err.toString());
                                              });
                                              });

                                              // Iniciar servidor
                                              const PORT = 3000;
                                              app.listen(PORT, () => {
                                                console.log(`🚀 API corriendo en http://localhost:${PORT}`);
                                                });