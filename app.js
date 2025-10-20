    // app.js - script movido do index.html
    document.addEventListener('DOMContentLoaded', () => {
        // Dados de exemplo (simula histórico de chamados)
        const conversationsData = [
            { id: 'c1', name: 'João Silva', email: 'joao@example.com', unread: 2,
                messages: [
                    {from:'agent', text:'Olá João, como posso ajudar hoje?', time:'2025-10-18 09:10'},
                    {from:'user', text:'Estou com erro no pagamento, a cobrança foi duplicada.', time:'2025-10-18 09:12'},
                    {from:'agent', text:'Posso verificar a transação. Qual o último dígito do cartão?', time:'2025-10-18 09:15'},
                    {from:'user', text:'Não desejo passar o cartão, quero estornar o valor que foi cobrado duas vezes.', time:'2025-10-18 09:17'},
                ]
            },
            { id: 'c2', name: 'Maria Gomes', email: 'maria@example.com', unread: 0,
                messages: [
                    {from:'user', text:'Não consigo acessar minha conta desde ontem.', time:'2025-10-17 18:05'},
                    {from:'agent', text:'Tentou resetar a senha?', time:'2025-10-17 18:07'},
                    {from:'user', text:'Sim, mas o link não chega no e-mail.', time:'2025-10-17 18:09'},
                ]
            },
            { id: 'c3', name: 'Sergio Pereira', email: 'sergio@example.com', unread: 1,
                messages: [
                    {from:'user', text:'Entrega atrasada do pedido #9876, preciso hoje.', time:'2025-10-16 12:00'},
                    {from:'agent', text:'Vou verificar com o parceiro logístico.', time:'2025-10-16 12:03'},
                ]
            }
        ];

        // Render conversation list
        const convListEl = document.getElementById('conversations');
        function renderConversations(filter=''){
            convListEl.innerHTML = '';
            const f = filter.trim().toLowerCase();
            conversationsData.filter(c => {
                return (!f) || c.name.toLowerCase().includes(f) || (c.messages.some(m => m.text.toLowerCase().includes(f)));
            }).forEach(c => {
                const div = document.createElement('div');
                div.className = 'conv';
                div.dataset.id = c.id;
                div.innerHTML = `
                    <div class="avatar">${c.name.split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
                    <div class="meta">
                        <div style="display:flex;justify-content:space-between;align-items:center;">
                            <div class="name">${c.name}</div>
                            <div class="small">${c.messages[c.messages.length-1].time.split(' ')[0]}</div>
                        </div>
                        <div class="last">${c.messages[c.messages.length-1].text}</div>
                    </div>
                    ${c.unread? `<div class="unread">${c.unread}</div>` : ''}
                `;
                div.addEventListener('click', ()=>selectConversation(c.id));
                convListEl.appendChild(div);
            });
        }

        // Conversation selection and UI binding
        let activeConv = null;
        function selectConversation(id){
            activeConv = conversationsData.find(c=>c.id===id);
            document.getElementById('activeName').textContent = activeConv.name;
            document.getElementById('activeStatus').textContent = 'Última atividade: ' + activeConv.messages[activeConv.messages.length-1].time;
            document.getElementById('metaClient').textContent = activeConv.email;
            document.getElementById('metaCount').textContent = activeConv.messages.length;
            renderMessages(activeConv.messages);
            document.getElementById('msgInput').disabled = false;
            document.getElementById('sendBtn').disabled = false;
            // Generate summary automatically on select
            document.getElementById('summary').value = generateSummary(activeConv);
            // Mark unread as read visually
            activeConv.unread = 0;
            renderConversations(document.getElementById('filter').value);
        }

        function renderMessages(messages){
            const el = document.getElementById('messages');
            el.innerHTML = '';
            messages.forEach(m => {
                const d = document.createElement('div');
                d.className = 'msg ' + (m.from === 'user' ? 'user' : 'agent');
                d.innerHTML = `<div style="font-size:12px;color:var(--muted);margin-bottom:6px">${m.time}</div><div>${escapeHtml(m.text)}</div>`;
                el.appendChild(d);
            });
            el.scrollTop = el.scrollHeight;
        }

        function escapeHtml(s){
            return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        }

        // Simple local "IA" summarizer: extracts intents, issues and actions from last N messages
        function generateSummary(conv){
            const recent = conv.messages.slice(-8).map(m => ({from:m.from, text:m.text.toLowerCase()}));
            const issues = [];
            const actions = [];
            const keywords = {
                pagamento: ['pagamento','cobran','estorno','cartão','duplicad','débito','cobr'],
                acesso: ['acess','senha','login','entrar','e-mail','link'],
                entrega: ['entreg','pedido','frete','logíst','atrasad','envio'],
                erro: ['erro','bug','crash','não funciona','falha'],
                cancelamento: ['cancel','estorno','devoluç','reembolso']
            };
            // detect categories
            for(const k in keywords){
                for(const word of keywords[k]){
                    if(recent.some(r=>r.text.includes(word))){
                        issues.push(k);
                        break;
                    }
                }
            }
            // extract explicit user requests and action words
            recent.forEach(r=>{
                if(r.from==='user'){
                    if(/estorn|reembols|estornar/.test(r.text)) actions.push('Solicita estorno/reembolso');
                    if(/resetar|link.*senha|senha/.test(r.text)) actions.push('Solicita reset de senha / link de acesso');
                    if(/entreg|atrasad|hoje/.test(r.text)) actions.push('Solicita atualização sobre entrega');
                    if(/cobr|duplicad|pagamento/.test(r.text)) actions.push('Relata cobrança indevida/duplicada');
                    if(/cancelar/.test(r.text)) actions.push('Solicita cancelamento');
                }
            });

            // build concise summary
            const uniq = (arr)=>[...new Set(arr)];
            const issueText = uniq(issues).length ? (`Assuntos detectados: ${uniq(issues).join(', ')}.`) : '';
            const actionText = uniq(actions).length ? (`Principais solicitações: ${uniq(actions).join('; ')}.`) : '';
            // include brief excerpt of last customer message
            const lastUser = [...recent].reverse().find(r=>r.from==='user');
            const lastExcerpt = lastUser ? `Última mensagem do cliente: "${truncate(lastUser.text, 140)}".` : '';
            const status = `Mensagens registradas: ${conv.messages.length}.`;
            const summary = [issueText, actionText, lastExcerpt, status].filter(Boolean).join(' ');
            return capitalizeFirst(summary || 'Nenhum chamado relevante identificado nos últimos registros.');
        }

        function truncate(s, n){
            return s.length>n ? s.slice(0,n-1) + '…' : s;
        }
        function capitalizeFirst(s){ return s.charAt(0).toUpperCase()+s.slice(1); }

        // UI events
        document.getElementById('filter').addEventListener('input', (e)=> renderConversations(e.target.value));
        document.getElementById('sendBtn').addEventListener('click', sendMessage);
        document.getElementById('msgInput').addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ e.preventDefault(); sendMessage(); }});

        function sendMessage(){
            const input = document.getElementById('msgInput');
            const text = input.value.trim();
            if(!text || !activeConv) return;
            const now = new Date();
            const time = now.toISOString().slice(0,16).replace('T',' ');
            const msg = {from:'agent', text, time};
            activeConv.messages.push(msg);
            renderMessages(activeConv.messages);
            input.value = '';
            // regenerate summary automatically after sending
            document.getElementById('summary').value = generateSummary(activeConv);
            document.getElementById('metaCount').textContent = activeConv.messages.length;
        }

        document.getElementById('regen').addEventListener('click', ()=>{
            if(!activeConv) return alert('Selecione uma conversa primeiro.');
            document.getElementById('summary').value = generateSummary(activeConv) + ' (regenerado)';
        });

        document.getElementById('saveSummary').addEventListener('click', ()=>{
            if(!activeConv) return alert('Selecione uma conversa primeiro.');
            // Simula salvar: armazena no objeto local
            activeConv.summary = document.getElementById('summary').value;
            alert('Resumo salvo localmente para ' + activeConv.name + '.');
        });

        document.getElementById('viewLog').addEventListener('click', ()=>{
            if(!activeConv) return alert('Selecione uma conversa primeiro.');
            const log = activeConv.messages.map(m=>`${m.time} - ${m.from}: ${m.text}`).join('\n\n');
            // abre em nova janela com histórico
            const w = window.open('', '_blank', 'width=700,height=600');
            w.document.write('<pre style="white-space:pre-wrap;font-family:inherit;padding:12px;">'+escapeHtml(log)+'</pre>');
        });

        // small helpers
        document.getElementById('closeBtn').addEventListener('click', ()=> alert('Fechar conversa (simulado).'));
        document.getElementById('tagBtn').addEventListener('click', ()=> {
            const tag = prompt('Adicionar tag:');
            if(tag && activeConv) alert('Tag "'+tag+'" adicionada a ' + activeConv.name + ' (simulado).');
        });

        // init
        renderConversations();
    });