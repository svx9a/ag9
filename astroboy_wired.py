import subprocess
import os
import sys
import time
import socket
import threading

class AstroBoyWired:
    def __init__(self):
        self.backend_port = 3001
        self.frontend_port = 3000
        self.processes = []

    def log(self, message):
        print(f"[AstroBoy] {message}")

    def check_port(self, port):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            return s.connect_ex(('localhost', port)) == 0

    def hyper_execute(self, command, name, cwd=None):
        self.log(f"Activating atomic thrust for {name}...")
        process = subprocess.Popen(
            command,
            shell=True,
            cwd=cwd or os.getcwd(),
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True
        )
        self.processes.append(process)
        
        def stream_output():
            for line in process.stdout:
                print(f"[{name}] {line.strip()}")
        
        threading.Thread(target=stream_output, daemon=True).start()
        return process

    def run(self):
        print("\n" + "="*50)
        print("  🚀 ASTROBOY CORE: WIRED UP EVERYTHING 🚀  ")
        print("="*50 + "\n")

        # Step 1: Predictive Caching - Check dependencies
        self.log("Predictive caching: Checking environment...")
        if not os.path.exists("node_modules"):
            self.log("Missing node_modules. Hyper-executing install...")
            subprocess.run("npm install", shell=True)
        
        # Step 2: Atomic Batch - Start Backend
        if self.check_port(self.backend_port):
            self.log(f"Backend already running on port {self.backend_port}.")
        else:
            self.hyper_execute("npm run server", "BACKEND")
            time.sleep(2) # Give it time to start

        # Step 3: Atomic Batch - Start Frontend
        if self.check_port(self.frontend_port):
            self.log(f"Frontend already running on port {self.frontend_port}.")
        else:
            self.hyper_execute("npm run dev", "FRONTEND")

        # Step 4: Performance Telemetry - Health Check
        self.log("Monitoring performance telemetry...")
        try:
            while True:
                time.sleep(5)
                be_status = "ONLINE" if self.check_port(self.backend_port) else "OFFLINE"
                fe_status = "ONLINE" if self.check_port(self.frontend_port) else "OFFLINE"
                self.log(f"Health Status -> Backend: {be_status} | Frontend: {fe_status}")
                
                if be_status == "OFFLINE" or fe_status == "OFFLINE":
                    self.log("Warning: System instability detected. Re-evaluating core...")
        except KeyboardInterrupt:
            self.log("Atomic core shutdown initiated. Powering down...")
            for p in self.processes:
                p.terminate()
            sys.exit(0)

if __name__ == "__main__":
    orchestrator = AstroBoyWired()
    orchestrator.run()
