import os
import sys
import subprocess
import shutil

# Ensure UTF-8 output on Windows consoles
if sys.platform == 'win32' and hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

base_dir = os.path.dirname(os.path.abspath(__file__))
nodejs_dir = r"C:\Program Files\nodejs"
os.environ["PATH"] = nodejs_dir + os.pathsep + os.environ.get("PATH", "")
npm_path = os.path.join(nodejs_dir, "npm.cmd") if os.path.exists(os.path.join(nodejs_dir, "npm.cmd")) else "npm"

# Automatically find all subdirectories that have a package.json
dirs = [
    d for d in os.listdir(base_dir)
    if os.path.isdir(os.path.join(base_dir, d))
    and os.path.exists(os.path.join(base_dir, d, "package.json"))
]
dirs.sort()

print(f"Found {len(dirs)} apps to build: {', '.join(dirs)}\n")

success_count = 0
for d in dirs:
    full_path = os.path.join(base_dir, d)
    print(f"--- Building {d} ---")
    try:
        subprocess.run([npm_path, "run", "build"], cwd=full_path, check=True, shell=True)
        dist_html = os.path.join(full_path, "dist", "index.html")
        if os.path.exists(dist_html):
            main_html = os.path.join(full_path, "index.html")
            backup_html = os.path.join(full_path, "index_dev.html")
            if os.path.exists(main_html) and not os.path.exists(backup_html):
                shutil.copy2(main_html, backup_html)
            shutil.copy2(dist_html, main_html)
            print(f"[OK] Deployed {d}/index.html\n")
            success_count += 1
        else:
            print(f"[FAIL] dist/index.html not found for {d}\n")
    except Exception as e:
        print(f"[FAIL] Failed {d}: {e}\n")

print(f"All done! Successfully built {success_count}/{len(dirs)} apps.")
