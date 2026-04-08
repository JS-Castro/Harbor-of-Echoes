import caseFile from "../../data/cases/vale-disappearance/case.json";
import entitiesFile from "../../data/cases/vale-disappearance/entities.json";
import evidenceFile from "../../data/cases/vale-disappearance/evidence.json";
import eventsFile from "../../data/cases/vale-disappearance/events.json";
import locationsFile from "../../data/cases/vale-disappearance/locations.json";

export type CaseLocaleCode = "en" | "pt-PT";

export type CanonicalCaseContent = {
  case: typeof caseFile;
  entities: Record<string, (typeof entitiesFile)[number]>;
  evidence: Record<string, (typeof evidenceFile)[number]>;
  events: Record<string, (typeof eventsFile)[number]>;
  locations: Record<string, (typeof locationsFile)[number]>;
};

export type CaseLocaleOverrides = {
  case?: {
    title?: string;
    tagline?: string;
    summary?: string;
    setting?: string;
    themes?: string[];
    canonicalQuestion?: string;
    canonicalOutcome?: string;
    statusLabel?: string;
  };
  entities?: Record<
    string,
    {
      name?: string;
      role?: string;
      summary?: string;
      description?: string;
      publicNotes?: string;
      hiddenNotes?: string;
    }
  >;
  evidence?: Record<
    string,
    {
      title?: string;
      sourceLabel?: string;
      summary?: string;
      content?: string;
    }
  >;
  events?: Record<
    string,
    {
      title?: string;
      description?: string;
    }
  >;
  locations?: Record<
    string,
    {
      name?: string;
      summary?: string;
      description?: string;
    }
  >;
};

export type LocalizedCaseContent = CanonicalCaseContent & {
  case: CanonicalCaseContent["case"] & { statusLabel: string };
};

function indexBy<T extends { slug?: string; code?: string }>(
  items: readonly T[],
  keySelector: (item: T) => string,
) {
  return Object.fromEntries(items.map((item) => [keySelector(item), item]));
}

const canonicalCaseContent: CanonicalCaseContent = {
  case: caseFile,
  entities: indexBy(entitiesFile, (entity) => entity.slug),
  evidence: indexBy(evidenceFile, (item) => item.code),
  events: indexBy(eventsFile, (event) => event.slug),
  locations: indexBy(locationsFile, (location) => location.slug),
};

const ptPtOverrides: CaseLocaleOverrides = {
  case: {
    title: "Caso 01: O Desaparecimento de Vale",
    tagline: "O mar guardou o som. A cidade enterrou o resto.",
    summary:
      "Mara Vale, investigadora ambiental, desaparece depois de descobrir dados falsificados sobre a segurança das turbinas ligados à Blackwake Energy. O jogador reconstrói a noite, separa rumor de prova e decide se a verdade aponta para um desaparecimento, homicidio ou encobrimento depois de uma queda acidental.",
    setting:
      "Cidade costeira castigada pela tempestade, com uma central mareomotriz, estradas do porto e um arquivo municipal restrito.",
    themes: [
      "lucro contra seguranca publica",
      "lealdade local contra verdade",
      "decomposicao institucional escondida por dependencia economica",
      "ambiguidade no motivo, clareza na responsabilidade",
    ],
    canonicalQuestion: "O que aconteceu a Mara Vale?",
    canonicalOutcome:
      "Mara morreu depois de um confronto coercivo; Elena Voss, o subagente Soren Pike e Tomas Reed participaram no encobrimento.",
    statusLabel: "rascunho",
  },
  entities: {
    "mara-vale": {
      role: "investigadora ambiental",
      summary: "Investigadora independente que descobre o escandalo da seguranca das turbinas.",
      description:
        "Mara e metódica, isolada e cada vez mais alarmada à medida que percebe que os relatórios publicados nao batem certo com os danos na costa.",
      publicNotes: "Figura teimosa com reputacao de jornalismo exaustivo.",
      hiddenNotes:
        "Guardou um pacote duplicado de provas num cacifo clandestino e planeava entregar o material a Jonah e a um regulador.",
    },
    "elena-voss": {
      role: "diretora de operacoes da Blackwake Energy",
      summary:
        "Executiva que descobre que os ficheiros foram copiados e ajuda a coordenar o encobrimento.",
      description:
        "Elena apresenta-se como alguem que protege a economia da cidade enquanto autoriza silenciosamente a eliminacao e substituicao de registos.",
      publicNotes: "Lider corporativa polida, focada na estabilidade e no emprego.",
      hiddenNotes:
        "Nao ordenou o homicidio, mas tornou o encobrimento possivel quando o confronto correu mal.",
    },
    "deputy-soren-pike": {
      role: "agente adjunto e guardiao do arquivo",
      summary:
        "Agente local que obstrui o escrutinio externo e ajuda a enterrar o que vem a seguir.",
      description:
        "Pike e o ponto de pressao entre a autoridade municipal e os interesses da Blackwake. Sinaliza os pedidos de acesso de Mara, chega ao local e mais tarde arquiva o caso como desaparecimento.",
      publicNotes: "Pratico, cansado e sempre perto da papelada oficial.",
      hiddenNotes:
        "Ja tinha ajudado a retirar uma queixa de seguranca anterior do fluxo de entrada.",
    },
    "tomas-reed": {
      role: "mestre do porto",
      summary:
        "O homem que organiza o encontro final e depois ajuda a mover provas.",
      description:
        "Tomas e leal ao porto e esta exposto às consequencias de um colapso da Blackwake, o que o torna facil de pressionar e de comprometer.",
      publicNotes: "Um funcionario civico cansado que mantém o porto a funcionar.",
      hiddenNotes:
        "Mente sobre o percurso nessa noite e discute se deve chamar ajuda depois da queda.",
    },
    "jonah-quill": {
      role: "jornalista local",
      summary:
        "Repórter que recebe parte do pacote de Mara e ajuda a estabelecer a cronologia.",
      description:
        "Jonah e uma das poucas pessoas em quem Mara confia o suficiente para fazer um briefing antes da publicacao. E util porque consegue ligar a trilha documental ao escrutinio publico.",
      publicNotes: "Uma perturbacao persistente para os responsaveis da cidade.",
      hiddenNotes:
        "Recebe apenas um pacote encriptado parcial depois de Mara desaparecer.",
    },
    "iris-fen": {
      role: "pescador",
      summary:
        "Testemunha com uma declaracao incompleta e medo de retaliação.",
      description:
        "Iris ouviu a discussao perto do caminho da falésia e mais tarde tenta corrigir o registo, mas a copia oficial do arquivo ja foi higienizada.",
      publicNotes: "Testemunha pouco fiavel aos olhos da cidade.",
      hiddenNotes:
        "A declaracao original mencionava duas vozes masculinas; a copia do arquivo removeu uma delas.",
    },
    "blackwake-energy": {
      role: "empresa de infraestruturas mareomotrizes",
      summary:
        "A empresa por tras da central, dos relatórios de seguranca e da pressao politica para manter o caso em silencio.",
      description:
        "A Blackwake depende do projeto das turbinas para a economia da cidade e usa essa alavanca para suprimir queixas e desviar o escrutinio.",
      publicNotes: "Empregador local e operador de infraestruturas.",
      hiddenNotes:
        "Os registos da empresa mostram dois relatórios de inspecao incompatíveis e uma entrada de registo apagada.",
    },
    "turbine-3": {
      role: "ativo industrial critico",
      summary: "A unidade com o defeito de vibracao oculto e a trilha forense mais forte.",
      description:
        "A Turbina 3 e o local onde a falha de seguranca foi escondida, tornando-a o centro tecnico do escandalo e nao apenas um elemento de fundo.",
      publicNotes: "Uma das unidades da array mareomotriz.",
      hiddenNotes:
        "A versao perigosa do relatório de inspecao avisa que a falha pode causar um colapso mecanico catastrofico perto do canal do porto.",
    },
  },
  evidence: {
    "EV-001": {
      title: "Excerto do Caderno de Campo",
      sourceLabel: "Mara Vale",
      summary:
        "Notas manuscritas a descrever anomalias marinhas e preocupacao com relatórios falsificados.",
      content:
        "Mara regista zonas mortas perto do canal de descarga, um ruido de vibracao invulgar da Turbina 3 e a suspeita de que o registo de seguranca publicado esta incompleto.",
    },
    "EV-002": {
      title: "Fotograma CCTV do Porto",
      sourceLabel: "Camera do porto",
      summary: "Fotograma que mostra Mara a aproximar-se da estrada de servico às 20:42.",
      content:
        "Um fotograma granulado apanha Mara sozinha com o saco ao ombro perto da estrada de servico do porto pouco antes da janela do desaparecimento.",
    },
    "EV-003": {
      title: "Mensagem Telefonica de Tomas",
      sourceLabel: "Tomas Reed",
      summary: "Mensagem a convidar Mara para um encontro tardio.",
      content:
        "Tomas pede a Mara que se encontre com ele porque precisa de lhe dizer algo antes de ela publicar. A mensagem e calma, deliberada e esta temporizada no dia anterior ao desaparecimento.",
    },
    "EV-004": {
      title: "Relatorio Oficial de Pessoa Desaparecida",
      sourceLabel: "Subagente Pike",
      summary: "Relatório policial que enquadra o caso como desaparecimento e atrasa a busca.",
      content:
        "O relatório enfatiza a incerteza, classifica o caso como sensivel e omite sinais mais fortes de ferimento ou de jogo sujo.",
    },
    "EV-005": {
      title: "Transcricao da Entrevista: Jonah Quill",
      sourceLabel: "Entrevista jornalistica",
      summary:
        "Jonah explica que Mara tinha material publicavel e temia interferencia.",
      content:
        "Jonah confirma que Mara tinha material suficiente para uma reportagem e ja tinha começado a perguntar como verificar a cadeia de custodia antes de ir a publico.",
    },
    "EV-006": {
      title: "Conjunto de Fotografias Ambientais",
      sourceLabel: "Camera da Mara",
      summary: "Peixes mortos e espuma quimica junto ao canal de descarga.",
      content:
        "As fotografias mostram danos ambientais que nao batem com a mensagem publica de seguranca da Blackwake.",
    },
    "EV-007": {
      title: "Memorando Interno de Manutencao",
      sourceLabel: "Blackwake",
      summary: "Memorando a instruir os funcionarios para nao falarem de manutencao.",
      content:
        "Os funcionarios sao instruidos a encaminhar qualquer pergunta sobre rondas de manutencao noturnas para a operacao e a nao discutir a manutencao das turbinas com terceiros.",
    },
    "EV-008": {
      title: "Relatorio de Inspecao Duplicado A",
      sourceLabel: "Arquivo do contratante",
      summary: "Resumo estrutural seguro que contradiz a versao perigosa.",
      content:
        "Esta copia do relatório diz que a turbina continua dentro de parametros seguros de funcionamento e que apenas necessita de manutencao de rotina.",
    },
    "EV-009": {
      title: "Relatorio de Inspecao Duplicado B",
      sourceLabel: "Arquivo do contratante",
      summary: "Falha de vibracao perigosa e aviso de reparacao urgente.",
      content:
        "Esta versao avisa que a turbina pode falhar sob stress e que o canal do porto pode ser afetado se a falha nao for tratada de imediato.",
    },
    "EV-010": {
      title: "Camera de Trânsito da Viatura da Polícia",
      sourceLabel: "Camera municipal da estrada",
      summary: "Viatura de Pike perto da Estrada do Farol às 21:11.",
      content:
        "O fotograma de trânsito contradiz a declaracao posterior de Pike sobre onde estava durante a janela do desaparecimento.",
    },
    "EV-011": {
      title: "Registo de Chamadas",
      sourceLabel: "Registos telefonicos",
      summary: "Metadados a mostrar que Elena telefonou a Tomas às 21:20.",
      content:
        "A chamada dura quarenta e sete segundos e cai mesmo no meio da janela do confronto, ligando Elena à noite do desaparecimento.",
    },
    "EV-012": {
      title: "Declaracao da Testemunha: Iris Fen",
      sourceLabel: "Testemunha do porto",
      summary: "Declaracao a descrever uma discussao e duas vozes perto do caminho da falésia.",
      content:
        "Iris ouviu a discussao levada pelo vento desde o caminho da falésia e acreditou que havia dois homens a falar com Mara antes de o ruido parar.",
    },
    "EV-013": {
      title: "Declaracao da Testemunha Redigida",
      sourceLabel: "Processo policial",
      summary: "A copia oficial remove a referencia à segunda voz masculina.",
      content:
        "A versao do arquivo tem uma redaccao no sitio onde deveria estar a segunda voz masculina, o que sugere que o registo foi alterado depois dos factos.",
    },
    "EV-014": {
      title: "Exportacao do Registo de Acessos da Central",
      sourceLabel: "Central da Blackwake",
      summary: "Eliminacao suspeita por volta das 22:02.",
      content:
        "Uma entrada de acesso desaparece da exportacao e a eliminacao coincide com o momento em que o encobrimento deixa de ser passivo e passa a ativo.",
    },
    "EV-015": {
      title: "Rascunho da Mensagem de Voz",
      sourceLabel: "Telemovel da Mara",
      summary: "Mara diz que encontrou a peça que prova a intenção.",
      content:
        "O rascunho da mensagem de voz sugere que Mara acreditava ter prova nao apenas de negligencia, mas de encobrimento deliberado.",
    },
    "EV-016": {
      title: "Fragmento do Gravador",
      sourceLabel: "Fragmento de dispositivo recuperado",
      summary: "Audio danificado com discussao, pedido do saco e um som de escorregao.",
      content:
        "O fragmento inclui um intercambio hostil, um pedido pelo saco e pelo gravador, e uma mudanca brusca de apoio compativel com uma queda.",
    },
    "EV-017": {
      title: "Fotografias Forenses do Caminho da Falésia",
      sourceLabel: "Inspecao posterior",
      summary: "Barra de protecao partida, vestigios de sangue e ausencia de marcas de arrasto.",
      content:
        "A cena sugere uma queda seguida da movimentacao das provas, e nao uma luta que continuou pelo chao.",
    },
    "EV-018": {
      title: "Recibo do Cacifo do Terminal de Ferry",
      sourceLabel: "Registos do terminal",
      summary: "Recibo que mostra que Mara criou um deposito clandestino no dia anterior.",
      content:
        "O recibo prova que Mara esperava entregar material de forma indireta e que ja se tinha preparado para a possibilidade de interferencia.",
    },
    "EV-019": {
      title: "Desencriptacao Parcial do Pacote Encriptado",
      sourceLabel: "Jonah Quill",
      summary: "Pacote recuperado com registos selecionados da Blackwake e uma nota de capa inacabada.",
      content:
        "Jonah apenas consegue abrir parte do arquivo, mas os ficheiros coincidem com a trilha investigativa de Mara e mostram que ela estava a preparar um pacote publicavel.",
    },
    "EV-020": {
      title: "Lacuna no Arquivo de Queixas Anteriores",
      sourceLabel: "Arquivo Municipal",
      summary: "Uma queixa historica de seguranca foi removida da entrada policial.",
      content:
        "A auditoria ao arquivo mostra uma lacuna anterior ao desaparecimento de Mara, ligando Pike a uma supressao mais antiga e reforçando a teoria do encobrimento institucional.",
    },
  },
  events: {
    "mara-starts-investigation": {
      title: "Mara Inicia a Investigacao",
      description:
        "Mara começa a seguir a discrepancia entre os danos marinhos e os dados de seguranca publicados.",
    },
    "mara-meets-jonah": {
      title: "Mara Encontra Jonah",
      description:
        "Mara informa Jonah sobre o risco de publicacao e pede-lhe que espere ate a cadeia de custodia estar confirmada.",
    },
    "maintenance-memo-distributed": {
      title: "Memorando de Manutencao Distribuido",
      description:
        "A Blackwake diz aos funcionarios para nao falarem de manutencao nem das rondas noturnas.",
    },
    "duplicate-inspection-report-created": {
      title: "Criação dos Relatorios de Inspecao Duplicados",
      description:
        "Dois relatórios de inspecao contraditorios aparecem no arquivo do contratante.",
    },
    "dead-drop-prepared": {
      title: "Deposito Clandestino Preparado",
      description:
        "Mara guarda um pacote duplicado de provas num cacifo do terminal de ferry.",
    },
    "mara-leaves-flat": {
      title: "Mara Sai do Apartamento",
      description:
        "Mara sai de casa com o saco, o gravador e o telemovel.",
    },
    "harbor-approach-seen": {
      title: "Mara Vista na Aproximacao ao Porto",
      description:
        "A CCTV apanha Mara perto da estrada de servico do porto.",
    },
    "pike-vehicle-near-lighthouse-road": {
      title: "Viatura de Pike na Estrada do Farol",
      description:
        "Os dados de trânsito colocam a viatura de patrulha de Pike na estrada do farol durante a janela critica.",
    },
    "tomas-arrives-at-old-harbor": {
      title: "Tomas Chega ao Antigo Porto",
      description:
        "Tomas entra no perimetro antes do confronto.",
    },
    "elena-calls-tomas": {
      title: "Elena Liga a Tomas",
      description:
        "Elena liga a Tomas durante quarenta e sete segundos enquanto Mara esta no caminho da falésia.",
    },
    "confrontation-on-cliff-path": {
      title: "Confronto no Caminho da Falésia",
      description:
        "A discussao escala e Pike exige o saco e o gravador de Mara.",
    },
    "mara-falls": {
      title: "Mara Cai",
      description:
        "Mara escorrega por cima da barreira para o patamar de manutencao inferior.",
    },
    "access-log-deleted": {
      title: "Registo de Acesso Apagado",
      description:
        "Uma entrada de acesso da central e removida depois de a cena ser controlada.",
    },
    "missing-person-report-filed": {
      title: "Queixa de Pessoa Desaparecida Apresentada",
      description:
        "Pike declara Mara como desaparecida em vez de ferida e a busca começa tarde demais.",
    },
  },
  locations: {
    "tidal-plant": {
      name: "Central Mareomotriz da Blackwake",
      summary:
        "Instalação industrial onde a array mareomotriz e monitorizada e onde ficam os registos de seguranca.",
      description:
        "A central fica na margem do canal do porto e e o centro do escandalo de seguranca.",
    },
    "old-harbor": {
      name: "Antigo Porto",
      summary:
        "Zona historica do porto onde Tomas trabalha e onde o encontro final começa.",
      description:
        "Um porto de trabalho estreito com estradas de servico, portoes perimetrais e iluminacao cansada.",
    },
    "cliff-path": {
      name: "Caminho da Falésia",
      summary:
        "Caminho costeiro molhado sobre o canal da tempestade onde o confronto se torna fisico.",
      description:
        "A barra de protecao, o patamar de manutencao inferior e a zona de escorregao sao todos relevantes para a reconstrução forense.",
    },
    "lighthouse-road": {
      name: "Estrada do Farol",
      summary:
        "Estrada superior usada por viaturas de patrulha e um dos principais pontos de contradição na cronologia.",
      description:
        "A CCTV e os dados de trânsito colocam Pike nesta estrada no momento exacto em que ele depois diz estar noutro sitio.",
    },
    "maras-rented-flat": {
      name: "Apartamento Arrendado da Mara",
      summary:
        "Casa temporaria onde Mara organiza o pacote de provas e sai para o encontro final.",
      description:
        "O apartamento contem o caderno, os rastos do telemovel e o sinal de que ela ainda estava activamente a trabalhar no caso.",
    },
    "records-office": {
      name: "Arquivo Municipal",
      summary:
        "Ponto de acesso ao arquivo municipal onde Mara pede registos ambientais.",
      description:
        "Um choke point burocratico que mostra como a cidade gere a informacao e suprime queixas.",
    },
    "ferry-terminal-locker": {
      name: "Cacifo do Terminal de Ferry",
      summary:
        "Cacifo clandestino usado para guardar o pacote duplicado de provas de Mara.",
      description:
        "O recibo prova que Mara planeava publicar e temia que os ficheiros originais lhe fossem retirados.",
    },
  },
};

export const caseCanonicalLocale: CanonicalCaseContent = canonicalCaseContent;
export const casePtPtOverrides = ptPtOverrides;

export const caseLocales: Record<
  CaseLocaleCode,
  CanonicalCaseContent | (CanonicalCaseContent & { case: CanonicalCaseContent["case"] & { statusLabel: string } })
> = {
  en: caseCanonicalLocale,
  "pt-PT": {
    ...canonicalCaseContent,
    case: {
      ...canonicalCaseContent.case,
      ...ptPtOverrides.case,
      statusLabel: ptPtOverrides.case?.statusLabel ?? canonicalCaseContent.case.status,
    },
    entities: Object.fromEntries(
      Object.entries(canonicalCaseContent.entities).map(([slug, entity]) => [
        slug,
        {
          ...entity,
          ...(ptPtOverrides.entities?.[slug] ?? {}),
        },
      ]),
    ),
    evidence: Object.fromEntries(
      Object.entries(canonicalCaseContent.evidence).map(([code, item]) => [
        code,
        {
          ...item,
          ...(ptPtOverrides.evidence?.[code] ?? {}),
        },
      ]),
    ),
    events: Object.fromEntries(
      Object.entries(canonicalCaseContent.events).map(([slug, event]) => [
        slug,
        {
          ...event,
          ...(ptPtOverrides.events?.[slug] ?? {}),
        },
      ]),
    ),
    locations: Object.fromEntries(
      Object.entries(canonicalCaseContent.locations).map(([slug, location]) => [
        slug,
        {
          ...location,
          ...(ptPtOverrides.locations?.[slug] ?? {}),
        },
      ]),
    ),
  },
};

export function getValeDisappearanceLocale(locale: CaseLocaleCode) {
  return caseLocales[locale];
}
