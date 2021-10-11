/**
 * Contém vários métodos que retornam os diversos tipos de consultas ao sistema
 * Já retorna formatado em JSON
 * @constructor
 */
function Payloads(){

}

/**
 * Recebe uma data Javascript (Date()) e retorna essa data em formato MySQL AAAA-MM-DD HH:MM:SS
 * @param hoje
 * @returns {string}
 */
Payloads.prototype.toMySQLDate = function(hoje){
    var ano = hoje.getFullYear().toString();
    var mes = (hoje.getMonth() + 1).toString();
    var dia = hoje.getDate().toString();
    var hora = hoje.getHours().toString();
    var minuto = hoje.getMinutes().toString();
    var segundo = hoje.getSeconds().toString();
    var pad = function(str){
        var tmp = ['00', '0', ''];
        return tmp[str.length] + str;
    };
    return ano + '-' + pad(mes) + '-' + pad(dia) + ' ' + pad(hora) + ':' + pad(minuto) + ':' + pad(segundo);
};

Payloads.prototype.apagar_relatorio = function(id_relatorio) {
    return JSON.stringify({
        "action":"SapiensRelatorio_Relatorio",
        "method":"destroyRelatorio",
        "data":[
            {
                "id":id_relatorio,
                // "criadoEm":"2020-10-19 16:40:39",
                // "observacao":"apague depois",
                // "documento_id":"",
                // "tipoRelatorio_id":1889,
                // "parametros":"",
                // "tipoSaida":""
            }
        ],
        "type":"rpc",
        "tid":3
    })
};

Payloads.prototype.relatorio_lista = function(id_user, page=1) {
    return JSON.stringify({
        "action":"SapiensRelatorio_Relatorio",
        "method":"getRelatorio",
        "data":[
            {
                "filter":[{"property":"criadoPor.id","value":"eq:"+id_user.toString()}],
                "fetch":["tipoRelatorio","documento","documento.componentesDigitais"],
                "page":page,
                "start":0,
                "limit":500
            }
        ],
        "type":"rpc",
        "tid":5
    });
};

Payloads.prototype.relatorioSetor = function(setor, inicio, fim, obs){
    // Relatório: OPERACIONAL
    // Espécie: ATIVIDADES
    // Tipo: ATIVIDADES LANÇADAS EM UM SETOR EM UM PERÍODO DE TEMPO (DETALHADO)
    // {"action":"SapiensRelatorio_Relatorio","method":"createRelatorio","data":[{"criadoEm":null,"observacao":"","documento_id":"","tipoRelatorio_id":467,"parametros":{"setor":6625,"dataHoraInicio":"2019-11-01T00:00:00","dataHoraFim":"2019-11-02T00:00:00"},"tipoSaida":"html"}],"type":"rpc","tid":25}
    return JSON.stringify({
        "action":"SapiensRelatorio_Relatorio",
        "method":"createRelatorio",
        "data":[
            {
                "criadoEm":null,
                "observacao":obs,
                "documento_id":"",
                "tipoRelatorio_id":467,
                "parametros":
                    {
                        "setor":setor,
                        "dataHoraInicio": MFt.dates.date2sql(inicio).replace(' ', 'T'), //"2019-11-01T00:00:00",
                        "dataHoraFim": MFt.dates.date2sql(fim).replace(' ', 'T') //"2019-11-02T00:00:00"
                    },
                "tipoSaida":"html"
            }
        ],
        "type":"rpc",
        "tid":25
    });
};

Payloads.prototype.relatorio = function(setor, inicio, fim, id_tipo_relatorio, obs){
    // Relatório: OPERACIONAL
    // Espécie: ATIVIDADES
    // Tipo: ATIVIDADES LANÇADAS EM UM SETOR EM UM PERÍODO DE TEMPO (DETALHADO)
    // {"action":"SapiensRelatorio_Relatorio","method":"createRelatorio","data":[{"criadoEm":null,"observacao":"","documento_id":"","tipoRelatorio_id":467,"parametros":{"setor":6625,"dataHoraInicio":"2019-11-01T00:00:00","dataHoraFim":"2019-11-02T00:00:00"},"tipoSaida":"html"}],"type":"rpc","tid":25}
    if (typeof setor !== 'number') throw new Error('Setor não é número');
    if (!(inicio instanceof Date)) throw new Error('Inicio não é Date');
    if (!(fim instanceof Date)) throw new Error('Fim não é Date');
    if (typeof id_tipo_relatorio !== 'number') throw new Error('ID do tipo de relatório não é número');
    return JSON.stringify({
        "action":"SapiensRelatorio_Relatorio",
        "method":"createRelatorio",
        "data":[
            {
                "criadoEm":null,
                "observacao":obs || '',
                "documento_id":"",
                "tipoRelatorio_id":id_tipo_relatorio,
                "parametros":
                    {
                        "setor":setor,
                        "dataHoraInicio": MFt.dates.date2sql(inicio).replace(' ', 'T'), //"2019-11-01T00:00:00",
                        "dataHoraFim": MFt.dates.date2sql(fim).replace(' ', 'T') //"2019-11-02T00:00:00"
                    },
                "tipoSaida":"html"
            }
        ],
        "type":"rpc",
        "tid":25
    });
};


Payloads.prototype.identidade = function(){
    return JSON.stringify({
        "action":"SapiensMain_Usuario",
        "method":"getUsuario",
        "data":[
            {
                "sessao":true,
                "fetch":["colaborador","colaborador.modalidadeColaborador","colaborador.lotacoes","colaborador.lotacoes.setor","colaborador.lotacoes.setor.especieSetor","colaborador.lotacoes.setor.unidade","colaborador.lotacoes.setor.unidade.modalidadeOrgaoCentral"],
                "filter":[
                    {
                        "property":"colaborador.lotacoes.id",
                        "value":"isNotNull"
                    },
                    {
                        "property":"colaborador.lotacoes.setor.ativo",
                        "value":"eq:1"
                    }
                ],
                "page":1,
                "start":0,
                "limit":25
            }
        ],
        "type":"rpc",
        "tid":1
    });
};

Payloads.prototype.setores = function(id_unidade) {
    return JSON.stringify({
        "action":"SapiensMain_Setor",
        "method":"getSetor",
        "data":
            [
                {"filter":[
                    {
                        "property":"unidade.id",
                        "value":"eq:" + id_unidade.toString()
                    },
                    {
                        "property":"parent",
                        "value":"isNotNull"
                    }
                ],
                    "fetch":["unidade"],
                    "query":"",
                    "page":1,
                    "start":0,
                    "limit":500
                }
            ],
        "type":"rpc",
        "tid":8
    });
};

/**
 * Retorna os assuntos consultivos apresentados em "complemento" na hora de lançar a atividade
 */
Payloads.prototype.assuntosConsultivos = function(){
    return JSON.stringify({
        "action":"SapiensAdministrativo_AssuntoConsultivo",
        "method":"getAssuntoConsultivo",
        "data":[{"query":"","page":1,"start":0,"limit":100}],
        "type":"rpc","tid":5
    })
};

/**
 * Retorna o ID da Pasta
 * @param nup
 */
Payloads.prototype.getIdPastaPeloNUP = function(nup){
    var tmp = '';
    for(var i = 0, maxi = nup.length; i < maxi; i++){
        tmp += isNaN(nup.substr(i,1)) ? '': nup.substr(i,1);
    }
    nup = tmp;
    return JSON.stringify({
        "action":"SapiensAdministrativo_Pasta",
        "method":"getPasta",
        "data":[
            {"fetch":["interessados"],"limit":10,"filter":[],"query":nup,"page":1,"start":0}
        ],
        "type":"rpc",
        "tid":10
    });
};

/**
 * Retorna os movimentos
 * @returns {string}
 */
Payloads.prototype.movimentos = function(){
    return JSON.stringify();
};

/**
 *
 * @param colaborador_id NÃO É O user.id É O colaborador_id, que é obtido em usuariosDistribuicao
 * @returns {{action: string, method: string, data: [null], type: string, tid: number}}
 */
Payloads.prototype.afastamentos = function(colaborador_id){
    return JSON.stringify({
        "action":"SapiensMain_Afastamento",
        "method":"getAfastamento",
        "data":[{
            "fetch":["modalidadeAfastamento"],
            "page":1,
            "start":0,
            "limit":500,
            "filter":[{
                "property":"colaborador.id",
                "value":"eq:" + colaborador_id.toString()//"value":"eq:" + colaborador_id.toString()
            }]
        }],
        "type":"rpc",
        "tid":15
    });
};

Payloads.prototype.usuariosDistribuicao = function(setor_id){
    /*
    Na resposta existe um item chamado "estaAfastado" [true|false] que diz o que é óbvio
     */
    var dd = function(num){
        num = num.toString();
        var ar = ['00', '0', ''];
        return ar[num.length] + num;
    };
    var hoje = new Date();
    var afastamento_inicio = hoje.getFullYear().toString() + dd((hoje.getMonth() + 1).toString()) + dd(hoje.getDate()) + ' 000000';
    var afastamento_fim = hoje.getFullYear().toString() + dd((hoje.getMonth() + 1).toString()) + dd(hoje.getDate()) + ' 235959';
    //console.log('Afastamento inicio: ' + afastamento_inicio);
    //console.log('Afastamento fim: ' + afastamento_fim);
    /*
     Quero saber se o cidadão está afastado hoje.
     Se estiver afastado a partir de amanhã, significa que pode receber processo hoje
     As pré-férias devem ser marcadas no sistema.
      */
    return JSON.stringify({
        "action":"SapiensMain_Usuario",
        "method":"getUsuario",
        "data":[
            {
                "sessao":false,
                "fetch":["colaborador","colaborador.modalidadeColaborador","colaborador.lotacoes","colaborador.lotacoes.setor","colaborador.lotacoes.setor.especieSetor","colaborador.lotacoes.setor.unidade","colaborador.lotacoes.setor.unidade.modalidadeOrgaoCentral"],
                "filter":[{"property":"colaborador.lotacoes.setor","value":"eq:" + setor_id.toString()}],
                "afastamentoInicio":afastamento_inicio,
                "afastamentoFim":afastamento_fim,
                "query":"",
                "page":1,
                "start":0,
                "limit":500
            }
        ],
        "type":"rpc",
        "tid":20
    });
};

/**
 * Retorna os usuários que existe no setor indicado
 * @param setor_id
 * @returns {{action: string, method: string, data: [null], type: string, tid: number}}
 */
Payloads.prototype.usuariosSetor = function(setor_id) {  // Se quiser a informacao de afastamento, use usuariosDistribuicao()
    return JSON.stringify({
        "action":"SapiensMain_Usuario",
        "method":"getUsuario",
        "data":
            [
                {
                    "sessao":false,
                    "fetch":["colaborador"],
                    "filter":
                        [
                            {
                                "property":"colaborador.lotacoes.setor",
                                "value":"eq:" + setor_id
                            }
                        ],
                    //"afastamentoInicio":"20161213 150000",
                    //"afastamentoFim":"20161218 200000",
                    "query":"",
                    "page":1,
                    "start":0,
                    "limit":400
                }
            ],
        "type":"rpc",
        "tid":13
    });
};

Payloads.prototype.getTarefas = function(pasta_id, page, limit) {
    page = page || 1;
    limit = limit || 500;
    return JSON.stringify({
        "action":"SapiensAdministrativo_Tarefa",
        "method":"getTarefa",
        "data":[
            {
                "fetch":["pasta","pasta.setor","pasta.setor.unidade","pasta.relevancias","pasta.lembretes","pasta.assuntos","pasta.assuntos.assuntoAdministrativo","pasta.processoJudicial","especieTarefa","especieTarefa.generoTarefa","criadoPor","atualizadoPor","comunicacaoJudicial","comunicacaoJudicial.movimentoNacional","comunicacaoJudicial.modalidadeRepercussao","setorResponsavel","setorResponsavel.unidade","setorOrigem","setorOrigem.unidade","usuarioResponsavel","usuarioConclusaoPrazo","documento","documento.tipoDocumento","minutas","minutas.tipoDocumento","minutas.tipoDocumento.especieDocumento","minutas.vinculacoesDocumentos","minutas.vinculacoesDocumentos.documentoVinculado","minutas.vinculacoesDocumentos.documentoVinculado.tipoDocumento"],
                "filter":[{"property":"pasta.id","value":"eq:" + pasta_id.toString()}],
                "page":page,
                "start":0,
                "limit":limit
            }
        ],
        "type":"rpc",
        "tid":53
    });
};

/**
 *
 * @param setorResponsavelID
 * @param setorOrigemID
 * @param pastaID
 * @param advID
 * @param tipoTarefaID
 * @param finalPrazo {Date} PRECISA ESTAR COMO DATE
 * @param obs
 * @param urgente
 * @param inicioPrazo PRECISA ESTAR COMO DATE e é opcional, para quando se deseja inicar o prazo em data futura
 * @param fimPrazo  Está errado, não precisava dessa variável. Mas deixei por questões de compatibilidade.
 * @param postIt
 * @returns {String}
 */
Payloads.prototype.criarTarefa = function(setorResponsavelID, setorOrigemID, pastaID, advID, tipoTarefaID, finalPrazo, obs, urgente, inicioPrazo, fimPrazo, postIt, tramitar){
    finalPrazo.setHours(23, 59, 59);
    if (setorResponsavelID === undefined) throw new Error("Sem setor responsável");
    if (setorOrigemID === undefined) throw new Error("Sem setor de origem");
    if (pastaID === undefined) throw new Error("Sem Pasta");
    if (advID === undefined) throw new Error("Sem Advogado");
    if (tipoTarefaID === undefined) throw new Error("Sem Tipo da Tarefa");
    if (finalPrazo === undefined) throw new Error("Sem prazo final");
    if (postIt === undefined) postIt = '';
    if (obs === undefined) obs = '';
    if (!urgente) urgente = false;
    return JSON.stringify({
        "action":"SapiensAdministrativo_Tarefa",
        "method":"createTarefa",
        "data":
            [
                {
                    "observacao":obs ? obs.toUpperCase() : '',
                    "postIt":postIt,
                    "urgente":urgente,
                    "dataHoraInicioPrazo":MFt.dates.date2sql(inicioPrazo || new Date()),
                    "criadoEm":null,
                    "apagadoEm":null,
                    "atualizadoEm":null,
                    "dataHoraFinalPrazo":MFt.dates.date2sql(finalPrazo),
                    "dataHoraConclusaoPrazo":null,
                    "pasta_id":pastaID,
                    "especieTarefa_id":tipoTarefaID, // "TOMAR CIÊNCIA (ADMINISTRATIVO)"
                    "usuarioResponsavel_id":advID,
                    "setorResponsavel_id":setorResponsavelID,
                    "setorOrigem_id":setorOrigemID,
                    "documento_id":"",
                    "acompanhar":false,
                    "tramitar":!(!tramitar), // Não tramito o processo
                    "arquivar":"",
                    "usuarioConclusaoPrazo_id":"",
                    "criadoPor_id":"",
                    "atualizadoPor_id":"",
                    "acompanhada":false,
                    "comunicacaoJudicial_id":"",
                    "movimentoNacional_id":"",
                    "modalidadeRepercussao_id":"",
                    "replicar":false,
                    "migrarEtiqueta":false,
                    "redistribuida":false,
                    "distribuicaoAutomatica":false,
                    "idFormatado":""
                }
            ],
        "type":"rpc",
        "tid":28
    });
};

Payloads.prototype.criaTarefaDistAutomatica = function(setorResponsavelID, setorOrigemID, pastaID, tipoTarefaID, finalPrazo, obs, urgente, postIt, tramitar, usuario_responsavel_id){
    // Se nao indicado o usuario_responsavel_id, a tarefa sera do tipo automatica
    if (finalPrazo === undefined) throw new Error("Sem prazo final");
    finalPrazo.setHours(23, 59, 59);
    if (setorResponsavelID === undefined) throw new Error("Sem setor responsável");
    if (setorOrigemID === undefined) throw new Error("Sem setor de origem");
    if (pastaID === undefined) throw new Error("Sem Pasta");
    if (tipoTarefaID === undefined) throw new Error("Sem Tipo da Tarefa");
    if (obs === undefined) obs = '';
    if (!urgente) urgente = false;
    return JSON.stringify({
        "action":"SapiensAdministrativo_Tarefa",
        "method":"createTarefa",
        "data":
            [
                {
                    "observacao":obs ? obs.toUpperCase() : '',
                    "postIt":postIt || "",
                    "urgente":urgente,
                    "dataHoraInicioPrazo":MFt.dates.date2sql(new Date()),
                    "criadoEm":null,
                    "apagadoEm":null,
                    "atualizadoEm":null,
                    "dataHoraFinalPrazo":MFt.dates.date2sql(finalPrazo),
                    "dataHoraConclusaoPrazo":null,
                    "pasta_id":pastaID,
                    "especieTarefa_id":tipoTarefaID,
                    "usuarioResponsavel_id":usuario_responsavel_id ? usuario_responsavel_id : null,
                    "setorResponsavel_id":setorResponsavelID,
                    "setorOrigem_id":setorOrigemID,
                    "documento_id":"",
                    "acompanhar":false,
                    "tramitar":!(!tramitar),
                    "arquivar":"",
                    "usuarioConclusaoPrazo_id":"",
                    "criadoPor_id":"",
                    "atualizadoPor_id":"",
                    "acompanhada":false,
                    "comunicacaoJudicial_id":"",
                    "movimentoNacional_id":"",
                    "modalidadeRepercussao_id":"",
                    "replicar":false,
                    "migrarEtiqueta":false,
                    "redistribuida":false,
                    "distribuicaoAutomatica":!usuario_responsavel_id,
                    "idFormatado":""
                }
            ],
        "type":"rpc",
        "tid":39
    });
};

Payloads.prototype.criaTarefaDistAutomaticaSemTramitar = function(setorResponsavelID, setorOrigemID, pastaID, tipoTarefaID, finalPrazo, obs, urgente){
    // The only difference between "criarTarefa" is the field "usuarioResponsavel_id". When it is null it means automatic distribution
    finalPrazo.setHours(23, 59, 59);
    if (setorResponsavelID === undefined) throw new Error("Sem setor responsável");
    if (setorOrigemID === undefined) throw new Error("Sem setor de origem");
    if (pastaID === undefined) throw new Error("Sem Pasta");
    if (tipoTarefaID === undefined) throw new Error("Sem Tipo da Tarefa");
    if (finalPrazo === undefined) throw new Error("Sem prazo final");
    if (obs === undefined) obs = '';
    if (!urgente) urgente = false;
    return JSON.stringify({
        "action":"SapiensAdministrativo_Tarefa",
        "method":"createTarefa",
        "data":
            [
                {
                    "observacao":obs.toUpperCase(),
                    "postIt":"",
                    "urgente":urgente,
                    "dataHoraInicioPrazo":MFt.dates.date2sql(new Date()),
                    "criadoEm":null,
                    "apagadoEm":null,
                    "atualizadoEm":null,
                    "dataHoraFinalPrazo":MFt.dates.date2sql(finalPrazo),
                    "dataHoraConclusaoPrazo":null,
                    "pasta_id":pastaID,
                    "especieTarefa_id":tipoTarefaID,
                    "usuarioResponsavel_id":null,
                    "setorResponsavel_id":setorResponsavelID,
                    "setorOrigem_id":setorOrigemID,
                    "documento_id":"",
                    "acompanhar":false,
                    "tramitar":false,
                    "arquivar":"",
                    "usuarioConclusaoPrazo_id":"",
                    "criadoPor_id":"",
                    "atualizadoPor_id":"",
                    "acompanhada":false,
                    "comunicacaoJudicial_id":"",
                    "movimentoNacional_id":"",
                    "modalidadeRepercussao_id":"",
                    "replicar":false,
                    "migrarEtiqueta":false,
                    "redistribuida":false,
                    "distribuicaoAutomatica":false,
                    "idFormatado":""
                }
            ],
        "type":"rpc",
        "tid":39
    });
};

/**
 * Cria um Termo em Branco na pasta indicada, tendo como origem o setor indicado
 * @param pasta_id
 * @param setorOrigem_id ATENÇÃO: Não é o ID da Unidade, mas o Setor ID dentro da Unidade
 */
Payloads.prototype.criaTermoEmBranco = function(pasta_id, setorOrigem_id){
    // RESPOSTA
    // [{"type":"rpc","tid":14,"action":"SapiensAdministrativo_Documento","method":"createDocumento","result":{"0":{"success":true,"successes":[["Minuta criada com sucesso no NUP 00456.000005\/2018-11!"],["Componente digital criado com sucesso na minuta criada no NUP 00456.000005\/2018-11! <i class=\"icon-edit\" data-qtip=\"Minuta edit\u00e1vel\"><\/i> <a href=\"editor?d=196020319&c=112099319\" target=\"_blank\">HTML<\/a>"]]},"records":[{"id":196020319},{"id":196020319}],"success":true}}]
    if (!pasta_id) throw new Error('Pasta ID ausente');
    if (!setorOrigem_id) throw new Error('Setor de Origem ID ausente');
    var hoje = new Date();
    var ano = hoje.getFullYear().toString();
    var mes = (hoje.getMonth() + 1).toString();
    var dia = hoje.getDate().toString();
    var hora = hoje.getHours().toString();
    var minuto = hoje.getMinutes().toString();
    var segundo = hoje.getSeconds().toString();
    var pad = function(str){
        var tmp = ['00', '0', ''];
        return tmp[str.length] + str;
    };
    var dataHoraProducao = ano + '-' + pad(mes) + '-' + pad(dia) + ' ' + pad(hora) + ':' + pad(minuto) + ':' + pad(segundo);
    var ret = {
        "action":"SapiensAdministrativo_Documento",
        "method":"createDocumento",
        "data":
            [
                {
                    "numeroFolhas":0,
                    "dataHoraProducao":dataHoraProducao,
                    "localProducao":"",
                    "vinculado":false,
                    "copia":false,
                    "observacao":"",
                    "autor":"",
                    "pasta_id":pasta_id,
                    "redator":"",
                    "procedencia_id":"",
                    "tipoDocumento_id":39,
                    "modelo_id":340,
                    "comunicacaoRemessa_id":"",
                    "setorOrigem_id":setorOrigem_id,
                    "tarefaOrigem_id":"",
                    "visibilidadeRestrita":false,
                    "semEfeito":false,
                    "localizadorOriginal":"",
                    "minuta":true,
                    "outroNumero":"",
                    "criadoPor_id":"",
                    "origemDados_id":"",
                    "atualizadoPor_id":"",
                    "anexaCopia":"",
                    "descricaoOutros":"",
                    "anexaCopiaVinculados":false,
                    "parentId":null,
                    "leaf":false
                }
            ],
        "type":"rpc",
        "tid":14
    };
    return JSON.stringify(ret);
};


/**
 * Pega os dados de uma minuta (componentes digitais) a partir do ID do Documento
 * A resposta do servidor é:
 * [{"type":"rpc","tid":3,"action":"SapiensAdministrativo_ComponenteDigital","method":"getComponenteDigital","result":{"success":true,"total":1,"records":[{"id":112099319,"fileName":"TERMO.html","hash":"9a3781079336e1f4750a233f0344851684b6727e390ba3359d21838428da8755","numeracaoSequencial":1,"indexado":false,"versoesEliminadas":false,"tamanho":14443,"nivelComposicao":3,"mimetype":"text\/html","extensao":"html","editavel":true,"criadoEm":{"date":"2018-02-27 17:32:37"},"atualizadoEm":{"date":"2018-02-27 17:32:37"},"documento":{"id":196020319,"numeroFolhas":0,"dataHoraProducao":{"date":"2018-02-27 17:31:00"},"visibilidadeRestrita":false,"semEfeito":false,"minuta":true,"copia":false,"criadoEm":{"date":"2018-02-27 17:32:37"},"atualizadoEm":{"date":"2018-02-27 17:32:37"}},"assinaturas":[],"documento_id":196020319}]}}]
 * Quando uma minuta é criada, são fornecidos dois números: o Documento ID é o primeiro (&d=...), o segundo é o Componente Digital ID (&c=...)
 * A presente função usa o Documento ID para obter os Componentes Digitais que são os arquivos de verdade
 * "Componente digital criado com sucesso na minuta criada no NUP 00456.000005\/2018-11! <i class=\"icon-edit\" data-qtip=\"Minuta edit\u00e1vel\"><\/i> <a href=\"editor?d=196020319&c=112099319\" target=\"_blank\">HTML<\/a>"
 * @param documentoID
 */
Payloads.prototype.componentesDigitais = function(documentoID) {
    var ret = {
        "action":"SapiensAdministrativo_ComponenteDigital",
        "method":"getComponenteDigital",
        "data":
            [
                {
                    "fetch":["documento","assinaturas"],
                    "page":1,
                    "start":0,
                    "limit":25,
                    "filter":[
                        {
                            "property":"documento.id",
                            "value":"eq:" + documentoID.toString()
                        }
                    ]
                }
            ],
        "type":"rpc",
        "tid":3
    };
    return JSON.stringify(ret);
};


/**
 * Promove a juntada de uma minuta no processo. Veja que documentoID se refere ao documento ID mesmo e não ao componente digital
 * @param documentoID
 * @returns {string}
 */
Payloads.prototype.juntar = function(documentoID, tarefaID){
    // Resposta esperada:
    // [{"type":"rpc","tid":28,"action":"SapiensAdministrativo_Juntada","method":"createJuntada","result":{"0":{"success":true,"successes":["Juntada do documento id 1134282 realizada com sucesso no NUP 00456.000002\/2018-88 com o Sequencial n. 1!"]},"records":[{"id":1112411}],"success":true}}]
    var self = this;
    var ret = {
        "action":"SapiensAdministrativo_Juntada",
        "method":"createJuntada",
        "data":[
            {
                "numeracaoSequencial":"",
                "ativo":false,
                "documentoJuntado_id":documentoID,
                "criadoPor_id":"",
                "criadoEm":self.toMySQLDate(new Date()),
                "tarefa_id":tarefaID || "",
                "atividade_id":"",
                "comunicacao_id":"",
                "movimento":"",
                "vinculada":false
            }
        ],
        "type":"rpc",
        "tid":28
    };
    return JSON.stringify(ret);
};

Payloads.prototype.NUPCompleto = function(texto, limit) {
    var self = this;
    limit = limit || 200;
    var limpa = function (numero) {
        // Retira os caracteres "." "/" "-", mas deixa o dígito verificador da string
        temp = "";
        for (i = 0; i < numero.length; i++) if ((numero[i] >= '0') && (numero[i] <= '9')) temp += numero[i];
        return temp;
    };
    var nums = limpa(texto);
    if (nums.length === 0) throw new Error("NUP informado nao contem numeros");
    var ret = {
        "action":"SapiensAdministrativo_Pasta",
        "method":"getPasta",
        "data":[{"fetch":[],"limit":limit,"query":texto,"page":1,"start":0}],
        "type":"rpc",
        "tid":18
    };
    return JSON.stringify(ret);
};

Payloads.prototype.NUP_PastaCompleta = function(id_pasta){
    var ret = {
        "action":"SapiensAdministrativo_Pasta",
        "method":"getPasta",
        "data":[{
            "fetch":
                [
                    "classificacao",
                    "especiePasta",
                    "especiePasta.generoPasta",
                    "interessados",
                    "modalidadeFase",
                    "modalidadeMeio",
                    "modalidadeRisco",
                    "procedencia",
                    "setor",
                    "setor.unidade",
                    "localizador",
                    "volumes",
                    "criadoPor",
                    "atualizadoPor",
                    "comunicacaoOrigem",
                    "comunicacaoOrigem.pasta",
                    "vinculacoesPastas",
                    "vinculacoesPastas.pasta",
                    "vinculacoesPastas.pastaVinculada",
                    "vinculacoesPastas.modalidadeVinculacaoPasta",
                    "relevancias",
                    "pessoaRepresentada",
                    "pessoaInteressada",
                    "processoJudicial",
                    "processoJudicial.classeNacional",
                    "processoJudicial.orgaoJulgador",
                    "processoJudicial.orgaoJulgador.tribunal",
                    "processoJudicial.vinculacoesProcessosJudiciais",
                    "processoJudicial.vinculacoesProcessosJudiciais.modalidadeVinculacaoProcessoJudicial",
                    "processoJudicial.vinculacoesParametrosJudiciais",
                    "processoJudicial.vinculacoesParametrosJudiciais.parametroJudicial",
                    "origemDados"
                ],
            "limit":10,
            "filter":[{"property":"id","value":"eq:" + id_pasta.toString()}],"page":1,"start":0}],
        "type":"rpc",
        "tid":3
    };
    return JSON.stringify(ret);
};

Payloads.prototype.interessados = function(id_pasta) {
    var ret = {
            "action":"SapiensAdministrativo_Interessado",
            "method":"getInteressado",
            "data":[
                {
                    "fetch":
                        [
                            "pessoa",
                            "pessoa.cadastrosIdentificadores",
                            "pessoa.modalidadeGeneroPessoa",
                            "pessoa.modalidadeQualificacaoPessoa",
                            "modalidadeInteressado",
                            "criadoPor",
                            "atualizadoPor"
                        ],
                    "filter":
                        [
                            {
                                "property":"pasta.id",
                                "value":"eq:" + id_pasta.toString()
                            }
                        ],
                    "apagados":0,
                    "page":1,
                    "start":0,
                    "limit":250
                }
            ],
            "type":"rpc",
            "tid":22
    };
    return JSON.stringify(ret);
};

Payloads.prototype.criarAtividade = function(especieAtividade_id, setor_id, usuario_id, tarefa_id, minutas_id){
    if (!especieAtividade_id || !setor_id || !usuario_id || !tarefa_id) throw new Error("Dados insuficientes para lancar atividade");
    var json = {
        "action":"SapiensAdministrativo_Atividade",
        "method":"createAtividade",
        "data":
            [
                {
                    "dataHoraConclusao":MFt.dates.date2sql(new Date()),
                    "criadoPor_id":"",
                    "atualizadoPor_id":"",
                    "criadoEm":null,
                    "apagadoEm":null,
                    "atualizadoEm":null,
                    "observacao":"",
                    "encerraTarefa":true,
                    "tramitar":false,
                    "peticionamentoEletronico":false,
                    "especieAtividade_id":especieAtividade_id,
                    "reducaoLitigio_id":"",
                    "complementoReducaoLitigio":"",
                    "assuntoConsultivo_id":null,
                    "setor_id":setor_id,
                    "setorSubmeter_id":"",
                    "usuario_id":usuario_id,
                    "usuarioSubmeter_id":"",
                    "tarefa_id":tarefa_id,
                    "documento_id":"",
                    "minutas_id":minutas_id || [], // Array de Numeros ou array vazia quando nao houver nada para juntar
                    "destinoMinuta":"juntar",
                    "ciencia":"",
                    "renuncia":"",
                    "peticionamento":false,
                    "informacaoComplementar1":"",
                    "informacaoComplementar2":"",
                    "informacaoComplementar3":"",
                    "informacaoComplementar4":"",
                    "valor1":0,
                    "valor2":0,
                    "valor3":0,
                    "dataValor1":null,
                    "dataValor2":null,
                    "dataValor3":null
                }
            ],
        "type":"rpc",
        "tid":4
    };
    return JSON.stringify(json);
};

Payloads.prototype.getTarefasAbertasUsuario = function(user_id, maximo_tarefas, page) {
    maximo_tarefas = maximo_tarefas ? maximo_tarefas : 500;
    return JSON.stringify({
        "action":"SapiensAdministrativo_Tarefa",
        "method":"getTarefa",
        "data":
            [
                {
                    "fetch":[
                        "pasta",
                        "pasta.setor",
                        "pasta.setor.unidade",
                        "pasta.processoJudicial",
                        "especieTarefa",
                        "especieTarefa.generoTarefa",
                        "setorOrigem",
                        "setorOrigem.unidade",
                        "setorResponsavel",
                        "setorResponsavel.unidade",
                        "usuarioResponsavel",
                        "minutas",
                        "minutas.tipoDocumento",
                        "minutas.tipoDocumento.especieDocumento",
                        "minutas.componentesDigitais",
                        "minutas.componentesDigitais.assinaturas",
                        "minutas.vinculacoesDocumentos",
                        "minutas.vinculacoesDocumentos.documentoVinculado",
                        "minutas.vinculacoesDocumentos.documentoVinculado.tipoDocumento",
                        "minutas.vinculacoesDocumentos.documentoVinculado.componentesDigitais",
                        "minutas.vinculacoesDocumentos.documentoVinculado.componentesDigitais.assinaturas",
                        "criadoPor",
                        "atualizadoPor",
                        "pasta.localizador",
                        "pasta.relevancias",
                        "pasta.lembretes",
                        "pasta.interessados",
                        "pasta.interessados.pessoa",
                        "pasta.assuntos",
                        "pasta.assuntos.assuntoAdministrativo"
                    ],
                    "filter":[
                        {
                            "property":"usuarioResponsavel.id",
                            "value":"eq:" + user_id
                        },
                        {
                            "property":"dataHoraConclusaoPrazo",
                            "value":"isNull"
                        }
                    ],
                    "page":page || 1,
                    "start":0,
                    "limit":maximo_tarefas
                }
            ],
        "type":"rpc",
        "tid":13
    });
};

Payloads.prototype.buscaUsuario = function(nome){
    return JSON.stringify({
        "action":"SapiensMain_Usuario",
        "method":"getUsuario",
        "data":
            [
                {
                    "query":nome,
                    "page":1,
                    "start":0,
                    "limit":100
                }
            ],
        "type":"rpc",
        "tid":3
    });
};

Payloads.prototype.getUsuarios = function(setor_id) {
    var hoje = new Date();
    var amanha = new Date(hoje.getTime() + (1000 * 60 *60 *24));
    var tmp1 = hoje.getMonth() + 1; // os meses vão de 0 a 11
    var tmp2 = hoje.getDate();
    var hojestr = hoje.getFullYear() + (tmp1.toString().length === 1 ? '0' : '') + tmp1 + (tmp2.toString().length === 1 ? '0' : '') + tmp2 + ' 120000';
    tmp1 = amanha.getMonth() + 1; // os meses vão de 0 a 11
    tmp2 = amanha.getDate();
    var amanhastr = amanha.getFullYear() + (tmp1.toString().length === 1 ? '0' : '') + tmp1 + (tmp2.toString().length === 1 ? '0' : '') + tmp2 + ' 200000';
    return {
        "action":"SapiensMain_Usuario",
        "method":"getUsuario",
        "data":[
            {
                "sessao":false,
                "fetch":[],
                "filter":[
                    {
                        "property":"colaborador.lotacoes.setor",
                        "value":"eq:" + setor_id
                    }
                ],
                "afastamentoInicio": hojestr,
                "afastamentoFim": amanhastr,
                "query":"",
                "page":1,
                "start":0,
                "limit":25
            }
        ],
        "type":"rpc",
        "tid":18
    };
};

Payloads.prototype.getUsuariosJSON = function(setor_id) {
    var hoje = new Date();
    var amanha = new Date(hoje.getTime() + (1000 * 60 *60 *24));
    var tmp1 = hoje.getMonth() + 1; // os meses vão de 0 a 11
    var tmp2 = hoje.getDate();
    var hojestr = hoje.getFullYear() + (tmp1.toString().length === 1 ? '0' : '') + tmp1 + (tmp2.toString().length === 1 ? '0' : '') + tmp2 + ' 120000';
    tmp1 = amanha.getMonth() + 1; // os meses vão de 0 a 11
    tmp2 = amanha.getDate();
    var amanhastr = amanha.getFullYear() + (tmp1.toString().length === 1 ? '0' : '') + tmp1 + (tmp2.toString().length === 1 ? '0' : '') + tmp2 + ' 200000';
    return JSON.stringify({
        "action":"SapiensMain_Usuario",
        "method":"getUsuario",
        "data":[
            {
                "sessao":false,
                "fetch":["colaborador"],
                "filter":[
                    {
                        "property":"colaborador.lotacoes.setor",
                        "value":"eq:" + setor_id
                    }
                ],
                "afastamentoInicio": hojestr,
                "afastamentoFim": amanhastr,
                "query":"",
                "page":1,
                "start":0,
                "limit":500
            }
        ],
        "type":"rpc",
        "tid":18
    });
};

Payloads.prototype.getNomes = function(str){
    return JSON.stringify({
        "action": "SapiensMain_Usuario",
        "method": "getUsuario",
        "data": [{"query": str, "page": 1, "start": 0, "limit": 25}],
        "type": "rpc",
        "tid": Math.floor((Math.random() * 50)) + 1
    });
};

Payloads.prototype.getTodasUnidades = function(page = 1, limit = 500){
    return JSON.stringify({
        "action": "SapiensMain_Setor",
        "method": "getSetor",
        "data": [{
            "fetch": [],
            "filter": [{"property": "parent", "value": "isNull"}],
            "query": "",
            "page": page,
            "start": 0,
            "limit": limit
        }],
        "type": "rpc",
        "tid": Math.floor((Math.random() * 50)) + 1
    });
};

Payloads.prototype.getUnidadeID = function(id){
    if (!id) throw new Error('ID nao informado');
    return JSON.stringify({
        "action": "SapiensMain_Setor",
        "method": "getSetor",
        "data": [{
            "fetch": [],
            "filter": [{"property": "id", "value": `eq:${id}`}],
            "query": "",
            "page": 1,
            "start": 0,
            "limit": 500
        }],
        "type": "rpc",
        "tid": Math.floor((Math.random() * 50)) + 1
    });
};


Payloads.prototype.getSetores = function(unidade_id){
    return JSON.stringify({
        "action": "SapiensMain_Setor",
        "method": "getSetor",
        "data": [{
            "filter": [{"property": "unidade", "value": "eq:" + unidade_id.toString()}, {"property": "parent", "value": "isNotNull"}],
            "fetch": [],
            "query": "",
            "page": 1,
            "start": 0,
            "limit": 200
        }],
        "type": "rpc",
        "tid": Math.floor((Math.random() * 50)) + 1
    });
};

Payloads.prototype.getJuntadas = function(volume, page) {
    page = page || 1;
    return JSON.stringify({
        "action": "SapiensAdministrativo_Juntada",
        "method": "getJuntada",
        "data": [{
            "fetch": ["criadoPor", "documentoJuntado", "documentoJuntado.origemDados", "documentoJuntado.tipoDocumento", "documentoJuntado.setorOrigem", "documentoJuntado.setorOrigem.unidade", "documentoJuntado.pasta", "documentoJuntado.procedencia", "documentoJuntado.componentesDigitais", "documentoJuntado.componentesDigitais.assinaturas", "documentoJuntado.vinculacoesDocumentos", "documentoJuntado.vinculacoesDocumentos.modalidadeVinculacaoDocumento", "documentoJuntado.vinculacoesDocumentos.documentoVinculado", "documentoJuntado.vinculacoesDocumentos.documentoVinculado.tipoDocumento", "documentoJuntado.vinculacoesDocumentos.documentoVinculado.componentesDigitais", "documentoJuntado.vinculacoesDocumentos.documentoVinculado.componentesDigitais.assinaturas"],
            "filter": [{"property": "volume.id", "value": "eq:" + volume}, {"property": "vinculada", "value": "eq:0"}],
            "page": page,
            "start": 0,
            "limit": 500
        }],
        "type": "rpc",
        "tid": Math.floor(Math.random() * 80) + 1
    });
};

Payloads.prototype.cpf = function(cpf) {
    return JSON.stringify({
        "action":"SapiensReceitaFederal_PessoaFisica",
        "method":"getPessoaFisica",
        "data":[{"filter":[{"property":"id","value":cpf}],"page":1,"start":0,"limit":25}],
        "type":"rpc",
        "tid": Math.floor(Math.random() * 80) + 1
    });
};

Payloads.prototype.vincular = function(documentoIDPrincipal, documentoIDAnexo) {
    return JSON.stringify({
        "action":"SapiensAdministrativo_VinculacaoDocumento",
        "method":"createVinculacaoDocumento",
        "data":[
            {"modalidadeVinculacaoDocumento_id":1,"documento_id":documentoIDPrincipal,"documentoVinculado_id":documentoIDAnexo}
        ],
        "type":"rpc",
        "tid": Math.floor(Math.random() * 80) + 1
    });
};

Payloads.prototype.etiquetar = function(tarefa, etiqueta) {
    console.log(tarefa);
    let tarefa_id = tarefa.id;
    let observacao = tarefa.observacao;
    let urgente = tarefa.urgente;
    let dataHoraInicioPrazo = tarefa.dataHoraInicioPrazo.date;
    let criadoEm = tarefa.criadoEm.date;
    let atualizadoEm = tarefa.atualizadoEm.date;
    let dataHoraFinalPrazo = tarefa.dataHoraFinalPrazo ? tarefa.dataHoraFinalPrazo.date : null;
    let dataHoraConclusaoPrazo = tarefa.dataHoraConclusaoPrazo ? tarefa.dataHoraConclusaoPrazo.date : null;
    let pasta_id = tarefa.pasta_id;
    let especieTarefa_id = tarefa.especieTarefa_id;
    let usuarioResponsavel_id = tarefa.usuarioResponsavel_id;
    let setorResponsavel_id = tarefa.setorResponsavel_id;
    let setorOrigem_id = tarefa.setorOrigem_id ? tarefa.setorOrigem_id : "";
    let documento_id = tarefa.documento_id ? tarefa.documento_id : "";
    let acompanhar = tarefa.acompanhar ? tarefa.acompanhar : "";
    let tramitar = tarefa.tramitar ? tarefa.tramitar : "";
    let arquivar = tarefa.arquivar ? tarefa.arquivar : "";
    let usuarioConclusaoPrazo_id = tarefa.usuarioConclusaoPrazo_id ? tarefa.usuarioConclusaoPrazo_id : "";
    let criadoPor_id = tarefa.criadoPor_id;
    let atualizadoPor_id = tarefa.atualizadoPor_id ? tarefa.atualizadoPor_id : "";
    let acompanhada = tarefa.acompanhada ? tarefa.acompanhada : false;
    let comunicacaoJudicial_id = tarefa.comunicacaoJudicial_id ? tarefa.comunicacaoJudicial_id : "";
    let movimentoNacional_id = tarefa.movimentoNacional_id ? tarefa.movimentoNacional_id : "";
    let modalidadeRepercussao_id = tarefa.modalidadeRepercussao_id ? tarefa.modalidadeRepercussao_id : "";
    let replicar = tarefa.replicar ? tarefa.replicar : false;
    let migrarEtiqueta = tarefa.migrarEtiqueta ? tarefa.migrarEtiqueta : false;
    let redistribuida = tarefa.redistribuida ? tarefa.redistribuida : false;
    let distribuicaoAutomatica = tarefa.distribuicaoAutomatica ? tarefa.distribuicaoAutomatica : false;
    let idFormatado = tarefa.idFormatado ? tarefa.idFormatado : "";
    let retorno = {
        action:"SapiensAdministrativo_Tarefa",
        method:"updateTarefa",
        data:[
            {
                id:tarefa_id,
                observacao:observacao,
                postIt:etiqueta,
                urgente:urgente,
                dataHoraInicioPrazo:dataHoraInicioPrazo,
                criadoEm:criadoEm,
                apagadoEm:null,
                atualizadoEm:atualizadoEm,
                dataHoraConclusaoPrazo:dataHoraConclusaoPrazo,
                pasta_id:pasta_id,
                especieTarefa_id:especieTarefa_id,
                usuarioResponsavel_id:usuarioResponsavel_id,
                setorResponsavel_id:setorResponsavel_id,
                setorOrigem_id:setorOrigem_id,
                documento_id:documento_id,
                acompanhar:acompanhar,
                tramitar:tramitar,
                arquivar:arquivar,
                usuarioConclusaoPrazo_id:usuarioConclusaoPrazo_id,
                criadoPor_id:criadoPor_id,
                atualizadoPor_id:atualizadoPor_id,
                acompanhada:acompanhada,
                comunicacaoJudicial_id:comunicacaoJudicial_id,
                movimentoNacional_id:movimentoNacional_id,
                modalidadeRepercussao_id:modalidadeRepercussao_id,
                replicar:replicar,
                migrarEtiqueta:migrarEtiqueta,
                redistribuida:redistribuida,
                distribuicaoAutomatica:distribuicaoAutomatica,
                idFormatado:idFormatado
            }
            ],
        "type":"rpc",
        "tid": Math.floor(Math.random() * 80) + 1
    };
    if (dataHoraFinalPrazo) {
        retorno['dataHoraFinalPrazo'] = dataHoraFinalPrazo;
    }
    return JSON.stringify(retorno);
};

Payloads.prototype.buscarAtividadePelaTarefa = function(id_tarefa) {
    return JSON.stringify({
        "action":"SapiensAdministrativo_Atividade",
        "method":"getAtividade",
        "data":[{
            "apagados":0,
            "fetch":["especieAtividade","assuntoConsultivo","setor","usuario","documento","assuntoConsultivo","reducaoLitigio","documento.componentesDigitais"],
            "filter":[{
                "property":"tarefa.id",
                "value":"eq:" + id_tarefa.toString(),
            }],
            "page":1,
            "start":0,
            "limit":25
        }],
        "type":"rpc",
        "tid":16
    });
}

/**
 * Retorna todos os intervalos de salvamento de um componente digital.
 * Em regra o Sapiens salva a cada cinco minutos se houver alteração.
 * Um intervalo maior que 5 minutos e alguns segundos significa inatividade na peça.
 * O Header do Request precisa estar assim: headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
 * Por isso, a MFt.xml() não vai funcionar. Precisa ser uma versão modificada para aceitar headers.
 * @param id_componente {Number}
 * @returns {string}
 */
Payloads.prototype.detalhar_componente = function(id_componente) {
    return `entity=Sapiens%5CAdministrativoBundle%5CEntity%5CComponenteDigital&field=hash&id=${id_componente}`;
}

Payloads.prototype.excluir_tarefa = function(id_tarefa) {
    return JSON.stringify({
        "action":"SapiensAdministrativo_Tarefa",
        "method":"destroyTarefa",
        "data":[
            {
                "id":id_tarefa,
                // "observacao":"",
                // "postIt":"TESTE",
                // "urgente":false,
                // "dataHoraInicioPrazo":"2020-11-06 18:44:00",
                // "criadoEm":"2020-11-06 18:44:38",
                // "apagadoEm":null,
                // "atualizadoEm":"2020-11-06 18:44:38",
                // "dataHoraFinalPrazo":"2020-11-09 20:00:00",
                // "dataHoraConclusaoPrazo":null,
                // "pasta_id":19890136,
                // "especieTarefa_id":130,
                // "usuarioResponsavel_id":8499,
                // "setorResponsavel_id":89339,
                // "setorOrigem_id":89339,
                // "documento_id":"",
                // "acompanhar":"",
                // "tramitar":"",
                // "arquivar":"",
                // "usuarioConclusaoPrazo_id":"",
                // "criadoPor_id":8499,
                // "atualizadoPor_id":8499,
                // "acompanhada":false,
                // "comunicacaoJudicial_id":"",
                // "movimentoNacional_id":"",
                // "modalidadeRepercussao_id":"",
                // "replicar":false,
                // "migrarEtiqueta":false,
                // "redistribuida":false,
                // "distribuicaoAutomatica":false,
                // "idFormatado":"id: 92994861 - NUP: 00688.000807/2020-12 - prazo: 09-11-2020 20:00:00 - esp\u00e9cie: ELABORAR DESPACHO/EDITAL"
            }],
        "type":"rpc",
        "tid":89
    });
};
