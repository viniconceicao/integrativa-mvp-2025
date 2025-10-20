      // Variable to track selected channel for sending messages
        let selectedChannel = 'whatsapp';
        let currentClient = 'maria-silva';
        
        const channelConfig = {
            whatsapp: { name: 'WhatsApp', icon: 'fab fa-whatsapp', class: 'whatsapp' },
            email: { name: 'E-mail', icon: 'fas fa-envelope', class: 'email' },
            webchat: { name: 'Chat Web', icon: 'fas fa-comments', class: 'webchat' },
            instagram: { name: 'Instagram', icon: 'fab fa-instagram', class: 'instagram' }
        };

        // Client data structure
        const clientsData = {
            'maria-silva': {
                name: 'Maria Clara Silva',
                avatar: 'MC',
                avatarColor: '#2563eb',
                email: 'maria.clara@email.com',
                phone: '(19) 99999-8888',
                location: 'Campinas, SP',
                status: 'online',
                activeChannels: ['whatsapp', 'email', 'webchat'],
                messages: [
                    // Histórico expandido já existente no HTML
                ],
                notes: 'Cliente interessado em compra recorrente.\nPrefere contato via WhatsApp.\nEmpresa: Silva & Associados\nDecisor: Própria cliente',
                kpis: { messages: 12, channels: 4, avgTime: '1m 30s', satisfaction: '98%', attendants: 3, transfers: 0 }
            },
            'joao-pereira': {
                name: 'João Pereira',
                avatar: 'JP',
                avatarColor: '#16a34a',
                email: 'joao.pereira@empresa.com.br',
                phone: '(11) 98888-7777',
                location: 'São Paulo, SP',
                status: 'away',
                activeChannels: ['email', 'webchat'],
                messages: [],
                notes: 'Gestor de compras da empresa ABC Ltda.\nPrefere comunicação formal por e-mail.\nDecisão compartilhada com diretoria.',
                kpis: { messages: 8, channels: 2, avgTime: '3m 15s', satisfaction: '95%', attendants: 2, transfers: 1 }
            },
            'ana-costa': {
                name: 'Ana Costa',
                avatar: 'AC',
                avatarColor: '#dc2626',
                email: 'ana.costa@gmail.com',
                phone: '(21) 97777-6666',
                location: 'Rio de Janeiro, RJ',
                status: 'online',
                activeChannels: ['webchat', 'whatsapp'],
                messages: [],
                notes: 'Cliente fidelizada há 2 anos.\nSempre muito educada e satisfeita.\nCompra mensalmente.',
                kpis: { messages: 5, channels: 2, avgTime: '45s', satisfaction: '100%', attendants: 1, transfers: 0 }
            },
            'pedro-lima': {
                name: 'Pedro Lima',
                avatar: 'PL',
                avatarColor: '#ea580c',
                email: 'pedro@startup.tech',
                phone: '(85) 96666-5555',
                location: 'Fortaleza, CE',
                status: 'offline',
                activeChannels: ['instagram', 'whatsapp'],
                messages: [],
                notes: 'Jovem empreendedor, muito ativo no Instagram.\nPrefere linguagem mais descontraída.\nBusca soluções inovadoras.',
                kpis: { messages: 15, channels: 3, avgTime: '2m 45s', satisfaction: '92%', attendants: 2, transfers: 0 }
            },
            'carla-mendes': {
                name: 'Carla Mendes',
                avatar: 'CM',
                avatarColor: '#7c3aed',
                email: 'carla.mendes@consultoria.com',
                phone: '(47) 95555-4444',
                location: 'Florianópolis, SC',
                status: 'online',
                activeChannels: ['email', 'whatsapp'],
                messages: [],
                notes: 'Consultora experiente.\nMuito detalhista nas especificações.\nPrecisa de documentação completa.',
                kpis: { messages: 22, channels: 2, avgTime: '4m 12s', satisfaction: '97%', attendants: 3, transfers: 1 }
            }
        };

        // Toggle channel selector dropdown
        function toggleChannelSelector() {
            const options = document.getElementById('channelOptions');
            options.classList.toggle('show');
        }

        // Select channel for sending messages
        function selectChannel(channel) {
            selectedChannel = channel;
            const config = channelConfig[channel];
            const dropdown = document.querySelector('.channel-dropdown');
            
            // Update dropdown appearance
            dropdown.className = `channel-dropdown ${config.class}`;
            dropdown.innerHTML = `
                <i class="${config.icon}"></i>
                <span>${config.name}</span>
                <i class="fas fa-chevron-down" style="margin-left: auto; font-size: 10px;"></i>
            `;
            
            // Hide options
            document.getElementById('channelOptions').classList.remove('show');
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            const selector = document.querySelector('.channel-selector');
            if (!selector.contains(e.target)) {
                document.getElementById('channelOptions').classList.remove('show');
            }
        });

        // Client switching functionality
        document.querySelectorAll('.conversation-item').forEach(item => {
            item.addEventListener('click', () => {
                // Remove active class from all conversations
                document.querySelectorAll('.conversation-item').forEach(conv => conv.classList.remove('active'));
                // Add active class to clicked conversation
                item.classList.add('active');
                
                // Switch to selected client
                const clientId = item.getAttribute('data-client');
                switchToClient(clientId);
            });
        });

        // Switch to client function
        function switchToClient(clientId) {
            currentClient = clientId;
            const client = clientsData[clientId];
            
            updateChatHeader(client);
            updateCustomerPanel(client);
            loadClientMessages(client);
        }

        // Update chat header with client info
        function updateChatHeader(client) {
            const avatar = document.querySelector('.client-avatar');
            const name = document.querySelector('.client-details h3');
            const activeChannels = document.querySelector('.active-channels');
            
            avatar.textContent = client.avatar;
            avatar.style.background = client.avatarColor;
            name.textContent = client.name;
            
            // Update active channels
            activeChannels.innerHTML = client.activeChannels.map(channel => {
                const config = channelConfig[channel];
                return `<span class="mini-channel-badge ${config.class}">
                    <i class="${config.icon}"></i> ${config.name}
                </span>`;
            }).join('');
        }

        // Update customer panel
        function updateCustomerPanel(client) {
            // Update customer info
            document.querySelector('.customer-avatar').textContent = client.avatar;
            document.querySelector('.customer-avatar').style.background = client.avatarColor;
            document.querySelector('.customer-name').textContent = client.name;
            document.querySelector('.customer-details').innerHTML = `
                <div><i class="fas fa-envelope"></i> ${client.email}</div>
                <div><i class="fas fa-phone"></i> ${client.phone}</div>
                <div><i class="fas fa-map-marker-alt"></i> ${client.location}</div>
            `;
            
            // Update notes
            document.querySelector('.notes-textarea').value = client.notes;
            
            // Update KPIs
            const kpiCards = document.querySelectorAll('.kpi-card .kpi-value');
            kpiCards[0].textContent = client.kpis.messages;
            kpiCards[1].textContent = client.kpis.channels;
            kpiCards[2].textContent = client.kpis.avgTime;
            kpiCards[3].textContent = client.kpis.satisfaction;
            kpiCards[4].textContent = client.kpis.attendants;
            kpiCards[5].textContent = client.kpis.transfers;
        }

        // Load client messages (simplified for demo)
        function loadClientMessages(client) {
            const chatMessages = document.querySelector('.chat-messages');
            
            if (client.name === 'Maria Clara Silva') {
                // Keep existing Maria's messages
                return;
            }
            
            // Clear chat for other clients and show sample messages
            const existingMessages = chatMessages.querySelectorAll('.message, .attendant-change, .channel-transition');
            existingMessages.forEach(msg => {
                if (!msg.classList.contains('load-history-btn')) {
                    msg.remove();
                }
            });
            
            // Add sample messages for other clients
            const sampleMessages = getSampleMessagesForClient(client);
            sampleMessages.forEach(msgData => {
                const messageDiv = document.createElement('div');
                messageDiv.className = msgData.sent ? 'message sent' : 'message';
                messageDiv.innerHTML = `
                    <div class="message-content">
                        <div class="message-header">
                            <span class="channel-badge ${msgData.channel}">
                                <i class="${channelConfig[msgData.channel].icon}"></i> ${channelConfig[msgData.channel].name}
                            </span>
                            <span>${msgData.time}</span>
                        </div>
                        ${msgData.text}
                        <div class="message-time">${msgData.timestamp}</div>
                    </div>
                `;
                chatMessages.appendChild(messageDiv);
            });
        }

        // Get sample messages for different clients
        function getSampleMessagesForClient(client) {
            const samples = {
                'joao-pereira': [
                    {sent: false, channel: 'email', time: 'hoje • 14:30', timestamp: '14:30', text: 'Bom dia! Gostaria de solicitar uma proposta para 500 unidades do produto Y.'},
                    {sent: true, channel: 'email', time: 'hoje • 14:32', timestamp: '14:32', text: 'Bom dia João! Claro, vou preparar a proposta detalhada para você. Qual o prazo de entrega desejado?'},
                    {sent: false, channel: 'webchat', time: 'hoje • 15:15', timestamp: '15:15', text: 'Mudei para o chat para ser mais rápido. Preciso da entrega até o fim do mês.'}
                ],
                'ana-costa': [
                    {sent: false, channel: 'webchat', time: 'hoje • 13:10', timestamp: '13:10', text: 'Olá! Vim fazer meu pedido mensal. Podem me ajudar?'},
                    {sent: true, channel: 'webchat', time: 'hoje • 13:11', timestamp: '13:11', text: 'Oi Ana! Claro, sempre um prazer atendê-la. O pedido usual de sempre?'},
                    {sent: false, channel: 'webchat', time: 'hoje • 13:15', timestamp: '13:15', text: 'Isso mesmo! Muito obrigada pelo atendimento sempre excelente! ❤️'}
                ],
                'pedro-lima': [
                    {sent: false, channel: 'instagram', time: 'ontem • 18:45', timestamp: '18:45', text: 'Ei! Vi o post de vocês. Que horário vocês abrem amanhã?'},
                    {sent: true, channel: 'instagram', time: 'ontem • 19:02', timestamp: '19:02', text: 'Oi Pedro! Abrimos às 8h. Te mando mais detalhes no WhatsApp?'},
                    {sent: false, channel: 'whatsapp', time: 'hoje • 08:30', timestamp: '08:30', text: 'Migrei pro WhatsApp. Preciso de uma solução tech para minha startup!'}
                ],
                'carla-mendes': [
                    {sent: false, channel: 'email', time: 'ontem • 16:20', timestamp: '16:20', text: 'Boa tarde! Recebi o orçamento por e-mail. Está muito bom! Preciso de alguns esclarecimentos técnicos.'},
                    {sent: true, channel: 'email', time: 'ontem • 16:45', timestamp: '16:45', text: 'Ótimo Carla! Fico à disposição para esclarecer qualquer dúvida técnica.'},
                    {sent: false, channel: 'whatsapp', time: 'hoje • 09:15', timestamp: '09:15', text: 'Vim pelo WhatsApp para ser mais ágil. Podem me enviar as especificações completas?'}
                ]
            };
            
            return samples[client.name.toLowerCase().replace(' ', '-')] || [];
        }

        // Tab switching functionality
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Hide all tab contents
                document.querySelectorAll('[id$="-content"]').forEach(content => {
                    content.style.display = 'none';
                });
                
                // Show corresponding content
                const tabName = tab.getAttribute('data-tab');
                document.getElementById(tabName + '-content').style.display = 'block';
            });
        });

        // Load unified history functionality
        function loadHistory() {
            const btn = document.querySelector('.load-history-btn');
            const historyDiv = document.getElementById('chat-history');
            
            btn.innerHTML = '<div class="loading"></div> Carregando histórico omnicanal...';
            
            setTimeout(() => {
                historyDiv.style.display = 'block';
                btn.style.display = 'none';
                
                // Animate history messages
                const historyMessages = historyDiv.querySelectorAll('.message');
                historyMessages.forEach((msg, index) => {
                    setTimeout(() => {
                        msg.style.animation = 'messageSlide 0.3s ease-out';
                    }, index * 200);
                });
                
                // Show channel transitions
                const transitions = historyDiv.querySelectorAll('.channel-transition');
                transitions.forEach((transition, index) => {
                    setTimeout(() => {
                        transition.style.animation = 'messageSlide 0.3s ease-out';
                    }, (index + 1) * 500);
                });
            }, 1500);
        }

        // Send message functionality with unified chat
        function sendMessage() {
            const input = document.querySelector('.message-input');
            const message = input.value.trim();
            
            if (message) {
                const chatMessages = document.querySelector('.chat-messages');
                const config = channelConfig[selectedChannel];
                const client = clientsData[currentClient];
                
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message sent';
                messageDiv.innerHTML = `
                    <div class="message-content">
                        <div class="message-header">
                            <span class="channel-badge ${config.class}">
                                <i class="${config.icon}"></i> ${config.name}
                            </span>
                            <span>agora</span>
                        </div>
                        ${message}
                        <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    </div>
                `;
                
                chatMessages.appendChild(messageDiv);
                input.value = '';
                
                // Update conversation preview in sidebar
                updateConversationPreview(currentClient, message, selectedChannel);
                
                // Auto scroll to bottom
                chatMessages.scrollTop = chatMessages.scrollHeight;
                
                // Simulate customer response in different channel sometimes
                setTimeout(() => {
                    const responseChannel = Math.random() > 0.7 ? getRandomChannel() : selectedChannel;
                    const responseConfig = channelConfig[responseChannel];
                    
                    // Add channel transition if different
                    if (responseChannel !== selectedChannel) {
                        const transitionDiv = document.createElement('div');
                        transitionDiv.className = 'channel-transition';
                        transitionDiv.innerHTML = `
                            <i class="${responseConfig.icon}"></i> Cliente respondeu via ${responseConfig.name}
                        `;
                        chatMessages.appendChild(transitionDiv);
                    }
                    
                    const responseText = getRandomResponseForClient(client);
                    const responseDiv = document.createElement('div');
                    responseDiv.className = 'message';
                    responseDiv.innerHTML = `
                        <div class="message-content">
                            <div class="message-header">
                                <span class="channel-badge ${responseConfig.class}">
                                    <i class="${responseConfig.icon}"></i> ${responseConfig.name}
                                </span>
                                <span>agora</span>
                            </div>
                            ${responseText}
                            <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                        </div>
                    `;
                    
                    chatMessages.appendChild(responseDiv);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                    
                    // Update conversation preview with client response
                    updateConversationPreview(currentClient, responseText, responseChannel);
                }, 2000);
            }
        }

        // Update conversation preview in sidebar
        function updateConversationPreview(clientId, message, channel) {
            const conversationItem = document.querySelector(`[data-client="${clientId}"]`);
            const preview = conversationItem.querySelector('.conversation-preview');
            const time = conversationItem.querySelector('.conversation-time');
            const channelIcon = conversationItem.querySelector('.conversation-channel');
            
            const config = channelConfig[channel];
            
            // Update preview text (limit to 30 chars)
            const previewText = message.length > 30 ? message.substring(0, 30) + '...' : message;
            preview.querySelector('span').textContent = previewText;
            
            // Update channel icon
            channelIcon.className = `${config.icon} conversation-channel`;
            channelIcon.style.color = getChannelColor(channel);
            
            // Update time
            time.textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        }

        function getChannelColor(channel) {
            const colors = {
                whatsapp: '#25d366',
                email: '#3b82f6',
                webchat: '#7c3aed',
                instagram: '#e1306c'
            };
            return colors[channel] || '#6b7280';
        }

        // Helper functions for realistic simulation
        function getRandomChannel() {
            const channels = ['whatsapp', 'email', 'webchat'];
            return channels[Math.floor(Math.random() * channels.length)];
        }

        function getRandomResponseForClient(client) {
            const responses = {
                'Maria Clara Silva': [
                    'Perfeito! Muito obrigada pelo esclarecimento. 😊',
                    'Ótimo! E sobre o desconto mencionado?',
                    'Entendi! Vou fechar o pedido então.',
                    'Excelente atendimento como sempre! 👏'
                ],
                'João Pereira': [
                    'Entendi. Pode enviar por e-mail para documentar?',
                    'Preciso analisar com a diretoria.',
                    'Ótimo! Aguardo a proposta formal.',
                    'Muito profissional o atendimento.'
                ],
                'Ana Costa': [
                    'Muito obrigada! Vocês são ótimos! ❤️',
                    'Perfeito! Até o próximo mês então.',
                    'Sempre um prazer ser atendida aqui!',
                    'Obrigada pela agilidade de sempre! 😊'
                ],
                'Pedro Lima': [
                    'Show! Vocês são muito inovadores! 🚀',
                    'Perfeito! Isso vai revolucionar minha startup!',
                    'Top! Quando podemos implementar?',
                    'Massa! Vamos fechar negócio! 💪'
                ],
                'Carla Mendes': [
                    'Excelente! Preciso da documentação técnica.',
                    'Perfeito! Está tudo muito bem detalhado.',
                    'Ótimo trabalho! Vou recomendar vocês.',
                    'Muito profissional. Obrigada pela clareza.'
                ]
            };
            
            const clientResponses = responses[client.name] || responses['Maria Clara Silva'];
            return clientResponses[Math.floor(Math.random() * clientResponses.length)];
        }

        // Auto-resize textarea
        document.querySelector('.message-input').addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });

        // Enter to send message
        document.querySelector('.message-input').addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // Toggle differentials popup
        function toggleDifferentials() {
            const differentials = document.getElementById('differentials');
            differentials.classList.toggle('show');
        }

        // Search functionality
        document.querySelector('.search-bar input').addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase();
            // Simulate search results
            if (query.length > 2) {
                console.log('Searching unified conversations for:', query);
                // Here you would implement actual search logic across all channels
            }
        });

        // Search conversations
        document.querySelector('.conversations-search input').addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase();
            const conversations = document.querySelectorAll('.conversation-item');
            
            conversations.forEach(conv => {
                const name = conv.querySelector('.conversation-name').textContent.toLowerCase();
                const preview = conv.querySelector('.conversation-preview span').textContent.toLowerCase();
                
                if (name.includes(query) || preview.includes(query)) {
                    conv.style.display = 'flex';
                } else {
                    conv.style.display = 'none';
                }
            });
        });

        // Initialize tooltips and auto-show differentials
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize with Maria Silva (first client)
            switchToClient('maria-silva');
            
            // Auto-show differentials after 3 seconds for demo
            setTimeout(() => {
                toggleDifferentials();
            }, 3000);
        });

        // Simulate real-time updates
        setInterval(() => {
            const onlineCount = Math.floor(Math.random() * 5) + 10;
            document.querySelector('.status-indicator').innerHTML = `
                <div class="status-dot"></div>
                Online (${onlineCount})
            `;
        }, 10000);