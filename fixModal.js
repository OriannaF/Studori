  window.openIAFixModal = function(qId) {
    let q = null;
    let questionnaireName = '';
    const S = window.Quiz.S;
    if (S && S.questionnaires) {
      S.questionnaires.forEach(qq => {
        const f = (qq.questions || []).find(x => String(x.id) === String(qId));
        if (f) { q = f; questionnaireName = qq.name; }
      });
    }
    if (!q) {
      if (S && S.items) {
        const it = S.items.find(x => String(x.q.id) === String(qId));
        if (it) q = it.q;
      }
    }
    if (!q) return;

    if (q.type !== 'select') {
       toast('Por ahora solo se pueden corregir preguntas de opciones multiples con esta herramienta.');
       return;
    }

    const ov = document.createElement('div');
    ov.className = 'modal-overlay';
    const close = () => { if(document.body.contains(ov)) document.body.removeChild(ov); };
    
    const optsHTML = (q.options || []).map((o, i) => \
      <div style="margin-bottom:8px; display:flex; align-items:flex-start; gap:8px;">
        <label style="display:flex; flex-direction:column; align-items:center; gap:4px; font-weight:bold; font-size:12px; margin-top:6px;">
          <input type="checkbox" id="fix-opt-corr-\" \ style="transform:scale(1.2);"> Correcta
        </label>
        <textarea class="input" id="fix-opt-txt-\" style="flex:1; min-height:40px; font-family:inherit;">\</textarea>
      </div>
    \).join('');

    ov.innerHTML = \
    <div class="modal" role="dialog" aria-modal="true" style="max-width:600px; width:90%;">
      <div class="modal-head">
        <span class="material-symbols-outlined accent-ic">edit</span>
        <h3>Sugerir correccion a IA</h3>
      </div>
      <div class="modal-body" style="max-height:65vh; overflow-y:auto; padding-right:8px;">
        <div class="muted small" style="margin-bottom:16px;">
          Modifica los campos que estan mal. Al terminar, dale a <b>Copiar para IA</b> y pegalo en el chat de Antigravity para que suba el arreglo a la base de datos oficial.
        </div>
        <div style="margin-bottom:12px;">
          <label class="field-label">Pregunta</label>
          <textarea class="input" id="fix-qtext" style="width:100%; min-height:60px; font-weight:bold;">\</textarea>
        </div>
        <div style="margin-bottom:12px;">
          <label class="field-label">Opciones</label>
          \
        </div>
        <div style="margin-bottom:12px;">
          <label class="field-label">Explicacion (Opcional)</label>
          <textarea class="input" id="fix-qexpl" style="width:100%; min-height:60px;">\</textarea>
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn sm" id="btn-fix-cancel">Cancelar</button>
        <button class="btn sm primary" id="btn-fix-copy"><span class="material-symbols-outlined" style="font-size:16px;">content_copy</span> Copiar para IA</button>
      </div>
    </div>\;
    
    document.body.appendChild(ov);
    document.getElementById('btn-fix-cancel').onclick = close;
    document.getElementById('btn-fix-copy').onclick = () => {
       const new_text = document.getElementById('fix-qtext').value;
       const new_expl = document.getElementById('fix-qexpl').value;
       const new_opts = [];
       const new_corr = [];
       (q.options || []).forEach((o, i) => {
         new_opts.push(document.getElementById('fix-opt-txt-'+i).value);
         if (document.getElementById('fix-opt-corr-'+i).checked) {
           new_corr.push(i);
         }
       });
       
       const payload = {
         accion: 'Corregir pregunta',
         cuestionario: questionnaireName || 'Desconocido',
         pregunta_original: q.text,
         nueva_pregunta: new_text,
         nuevas_opciones: new_opts,
         nuevas_correctas_indice: new_corr,
         nueva_explicacion: new_expl
       };
       
       navigator.clipboard.writeText(JSON.stringify(payload, null, 2)).then(() => {
         toast('¡Copiado! Pegalo en el chat de Antigravity.');
         close();
       });
    };
  };
