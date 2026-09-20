#!/usr/bin/env python3
"""Quick start helper for running App and AV on the same laptop with a phone on the same Wi‑Fi."""

from __future__ import annotations

import socket
import sys
from pathlib import Path


def get_local_ip() -> str:
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as sock:
            sock.connect(("8.8.8.8", 80))
            return sock.getsockname()[0]
    except OSError:
        return "127.0.0.1"


def print_banner() -> None:
    print("\n" + "=" * 80)
    print(" HORIZON DRIVE — QUICK START ")
    print("=" * 80)


def print_project_info(root: Path) -> None:
    print(f"Workspace root: {root}")
    print("Detected folders:")
    for relative in ["AV", "App", "App/frontend", "App/backend"]:
        target = root / relative
        status = "OK" if target.exists() else "MISSING"
        print(f"  - {relative:<18} {status}")
    print()


def print_run_steps(local_ip: str) -> None:
    print("How to run it:")
    print("1) On the laptop, open 2 terminal tabs/windows:")
    print("   A. AV:")
    print("      python -m http.server 8001 --directory AV")
    print("   B. App:")
    print("      python -m http.server 8002 --directory App/frontend")
    print()
    print("2) If the backend is also needed, run it in a third terminal:")
    print("   cd App")
    print("   python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000")
    print()
    print("3) Open these URLs on the laptop:")
    print(f"   AV:  http://localhost:8001")
    print(f"   App: http://localhost:8002")
    print()
    print("4) Open these URLs from the phone on the same Wi‑Fi network:")
    print(f"   AV:  http://{local_ip}:8001")
    print(f"   App: http://{local_ip}:8002")
    print()
    print("Important:")
    print("- The laptop must be on the same Wi‑Fi network as the phone.")
    print("- The App and AV are served separately on different ports.")
    print("- The backend should stay on port 8000 and be reachable by the laptop IP.")
    print("- If a phone does not load the page, check the firewall and allow Python through the network.")


def main() -> int:
    root = Path(__file__).resolve().parent
    print_banner()
    print_project_info(root)
    local_ip = get_local_ip()
    print(f"Detected local IP for the phone: {local_ip}")
    print_run_steps(local_ip)
    print("\nDone. Use the laptop for AV and the phone for App, while both are running from the same machine.\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
