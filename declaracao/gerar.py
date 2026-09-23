"""Gera index.html (arquivo único, com as fotos embutidas) a partir de modelo.html.

Uso: python3 gerar.py
"""
import base64, json, pathlib, re

pasta = pathlib.Path(__file__).parent
html = (pasta / "modelo.html").read_text(encoding="utf-8")

fotos = {p.name: "data:image/jpeg;base64," + base64.b64encode(p.read_bytes()).decode()
         for p in sorted((pasta / "fotos").glob("*.jpg")) if p.name in html}

# <img src="fotos/x.jpg"> no HTML
html = re.sub(r'src="fotos/([^"]+)"', lambda m: f'src="{fotos[m.group(1)]}"', html)
# fotos montadas pelo JavaScript
html = html.replace('const foto = arq => "fotos/" + arq; // no arquivo final, as fotos ficam embutidas',
                    "const FOTOS_EMBUTIDAS = " + json.dumps(fotos) + ";\nconst foto = arq => FOTOS_EMBUTIDAS[arq];")
assert "fotos/" not in html.replace("fotos/*", ""), "sobrou caminho de foto sem embutir"

(pasta / "index.html").write_text(html, encoding="utf-8")
print(f"index.html gerado ({len(html) / 1e6:.1f} MB, {len(fotos)} fotos)")
