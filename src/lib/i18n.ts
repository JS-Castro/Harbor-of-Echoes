export const localeCookieName = "hoe-locale";
export const supportedLocales = ["en", "pt-PT"] as const;
export type AppLocale = (typeof supportedLocales)[number];

export const defaultLocale: AppLocale = "en";

export function normalizeLocale(value?: string | null): AppLocale {
  return supportedLocales.includes(value as AppLocale)
    ? (value as AppLocale)
    : defaultLocale;
}

type StaticDictionary = {
  languageLabel: string;
  languages: Record<AppLocale, string>;
  shared: {
    appTagline: string;
    openCase: string;
    confidence: string;
    location: string;
    source: string;
    discoveryPhase: string;
    relatedEntities: string;
    relatedEvidence: string;
    relatedLocations: string;
  };
  nav: {
    dashboard: string;
    evidence: string;
    timeline: string;
    board: string;
    report: string;
  };
  home: {
    heroAlt: string;
    caseLabel: string;
    titleLineOne: string;
    titleLineTwo: string;
    summary: string;
    enterInvestigation: string;
    reviewEvidenceVault: string;
    subjectFile: string;
    subjectNote: string;
    currentBuild: string;
    casePremise: string;
    premiseText: string;
    modules: string[];
    caseStats: { label: string; value: string }[];
  };
  dashboard: {
    brief: string;
    evidenceItems: string;
    entitiesInPlay: string;
    timelineEvents: string;
    primaryQuestion: string;
    unlockSummary: (count: number) => string;
    recentLeads: string;
    evidenceByEscalation: string;
    openVault: string;
    phase: string;
    coreCast: string;
  };
  evidenceList: {
    tagline: string;
    heading: string;
    summary: (count: number) => string;
  };
  evidenceDetail: {
    source: string;
    discoveryPhase: (phase: number) => string;
  };
  timeline: {
    tagline: string;
    heading: string;
    certainty: string;
  };
  board: {
    tagline: string;
    label: string;
    heading: string;
    description: string;
    sessionState: string;
    sessionHelp: string;
    addNote: string;
    addLinkLabel: string;
    addLinkPlaceholder: string;
    linkInstruction: string;
    noteTextLabel: string;
    noteMeta: string;
    newNoteTitle: string;
    notePlaceholder: string;
    noteCounter: (count: number) => string;
    removeNote: string;
    startLink: string;
    linkingFrom: string;
    linkReady: string;
    duplicateLinkHelp: string;
    removeLink: string;
    zoomIn: string;
    zoomOut: string;
    centerView: string;
    resetView: string;
    resetBoard: string;
  };
  report: {
    tagline: string;
    heading: string;
    instructions: string;
    currentTheory: string;
    pendingAnswer: string;
    axisPending: string;
    axisLocked: string;
    completion: (completed: number, total: number) => string;
    reset: string;
    bestCaseAnswer: string;
    axes: {
      cause: string;
      responsibility: string;
      motive: string;
    };
    answers: {
      cause: string[];
      responsibility: string[];
      motive: string[];
    };
    bestCase: {
      cause: string;
      responsibility: string;
      motive: string;
    };
  };
  entity: {
    subjectFile: string;
    evidenceLinks: (count: number) => string;
    locationLinks: (count: number) => string;
    dossier: string;
    publicNotes: string;
    hiddenNotes: string;
  };
  typeLabels: {
    entity: Record<string, string>;
    evidence: Record<string, string>;
    certainty: Record<string, string>;
  };
};

const dictionaries: Record<AppLocale, StaticDictionary> = {
  en: {
    languageLabel: "Language",
    languages: {
      en: "English",
      "pt-PT": "Portuguese",
    },
    shared: {
      appTagline: "Narrative investigation webapp",
      openCase: "Open Case",
      confidence: "Confidence",
      location: "Location",
      source: "Source",
      discoveryPhase: "Discovery phase",
      relatedEntities: "Related Entities",
      relatedEvidence: "Related Evidence",
      relatedLocations: "Related Locations",
    },
    nav: {
      dashboard: "Dashboard",
      evidence: "Evidence",
      timeline: "Timeline",
      board: "Board",
      report: "Report",
    },
    home: {
      heroAlt: "Foggy harbor at night",
      caseLabel: "Case 01: The Vale Disappearance",
      titleLineOne: "The sea kept the sound.",
      titleLineTwo: "The town buried the rest.",
      summary:
        "Mara Vale vanished days before exposing safety fraud tied to Blackwake Energy. Players inspect evidence, surface contradictions, and decide whether the truth points to a cover-up, a staged disappearance, or a death concealed by the town itself.",
      enterInvestigation: "Enter Investigation",
      reviewEvidenceVault: "Review Evidence Vault",
      subjectFile: "Subject File",
      subjectNote: "Investigator. Last seen near the harbor service road.",
      currentBuild: "Current Build",
      casePremise: "Case Premise",
      premiseText:
        "Blackwake's turbine records do not match the ecological damage in the harbor channel. Mara copied something that proved intent. She never made it to publication.",
      modules: [
        "Evidence vault with layered document views",
        "Interactive case board for links and notes",
        "Chronological reconstruction with contradictions",
        "Final report scoring across cause, motive, and responsibility",
      ],
      caseStats: [
        { label: "Evidence Items", value: "20" },
        { label: "Key Entities", value: "10" },
        { label: "Timeline Events", value: "14" },
        { label: "Primary Theories", value: "3" },
      ],
    },
    dashboard: {
      brief: "Investigation Brief",
      evidenceItems: "Evidence items",
      entitiesInPlay: "Entities in play",
      timelineEvents: "Timeline events",
      primaryQuestion: "Primary Question",
      unlockSummary: (count) =>
        `Unlock structure is already authored across ${count} rules. The app can now render the case from seeded content instead of hard-coded strings.`,
      recentLeads: "Recent Leads",
      evidenceByEscalation: "Evidence by escalation",
      openVault: "Open vault",
      phase: "Phase",
      coreCast: "Core Cast",
    },
    evidenceList: {
      tagline: "Searchable archive of the authored evidence set.",
      heading: "Case archive",
      summary: (count) => `${count} authored items across four investigation phases`,
    },
    evidenceDetail: {
      source: "Source",
      discoveryPhase: (phase) => `Discovery phase ${phase}`,
    },
    timeline: {
      tagline: "Chronological reconstruction of the investigation and disappearance night.",
      heading: "Timeline",
      certainty: "Certainty",
    },
    board: {
      tagline: "Interactive investigation board seeded from the case graph.",
      label: "Investigation Board",
      heading: "Relationship surface",
      description:
        "This first pass maps the authored case graph into a navigable board. The next layer is persisted notes, manual links, and drag state per investigation session.",
      sessionState: "Session State",
      sessionHelp: "Drag nodes to reorganize the case board. Layout is stored locally.",
      addNote: "Add Note",
      addLinkLabel: "Link Label",
      addLinkPlaceholder: "manual link",
      linkInstruction: "Drag from a node's right connector into another node's left connector.",
      noteTextLabel: "Note Text",
      noteMeta: "Manual Note",
      newNoteTitle: "New note",
      notePlaceholder: "Capture a lead, contradiction, or next step...",
      noteCounter: (count) => `${count} manual notes`,
      removeNote: "Remove Note",
      startLink: "Link",
      linkingFrom: "Linking from",
      linkReady: "Choose a target card to complete the link.",
      duplicateLinkHelp: "Connecting the same two nodes updates the existing manual link.",
      removeLink: "Remove link",
      zoomIn: "Zoom in",
      zoomOut: "Zoom out",
      centerView: "Center view",
      resetView: "Reset View",
      resetBoard: "Reset Board",
    },
    report: {
      tagline: "Structured final report aligned with the authored scoring axes.",
      heading: "Final Report",
      instructions:
        "Choose one answer for each axis to capture your current theory. Selections are stored locally for this case.",
      currentTheory: "Current Theory",
      pendingAnswer: "No conclusion selected yet.",
      axisPending: "Open",
      axisLocked: "Selected",
      completion: (completed, total) => `${completed}/${total} axes filled`,
      reset: "Reset Theory",
      bestCaseAnswer: "Best-Case Answer",
      axes: {
        cause: "Cause",
        responsibility: "Responsibility",
        motive: "Motive",
      },
      answers: {
        cause: [
          "Accidental fall",
          "Premeditated murder",
          "Suicide",
          "Staged disappearance",
        ],
        responsibility: [
          "Tomas alone",
          "Blackwake alone",
          "Shared cover-up",
          "Unknown",
        ],
        motive: [
          "Personal conflict",
          "Safety scandal",
          "Financial panic",
          "Political corruption",
        ],
      },
      bestCase: {
        cause: "Cause: accidental fall during a coercive confrontation.",
        responsibility: "Responsibility: shared cover-up by Pike, Tomas, and Elena.",
        motive: "Motive: concealment of the turbine safety scandal.",
      },
    },
    entity: {
      subjectFile: "Subject File",
      evidenceLinks: (count) => `${count} evidence links`,
      locationLinks: (count) => `${count} location links`,
      dossier: "Investigation dossier",
      publicNotes: "Public Notes",
      hiddenNotes: "Hidden Notes",
    },
    typeLabels: {
      entity: {
        person: "person",
        organization: "organization",
        location: "location",
        object: "object",
      },
      evidence: {
        note: "note",
        photo: "photo",
        message: "message",
        report: "report",
        transcript: "transcript",
        audio: "audio",
        log: "log",
      },
      certainty: {
        high: "high",
        medium: "medium",
        low: "low",
      },
    },
  },
  "pt-PT": {
    languageLabel: "Idioma",
    languages: {
      en: "Inglês",
      "pt-PT": "Português",
    },
    shared: {
      appTagline: "Webapp narrativa de investigação",
      openCase: "Abrir Caso",
      confidence: "Confiança",
      location: "Local",
      source: "Fonte",
      discoveryPhase: "Fase de descoberta",
      relatedEntities: "Entidades Relacionadas",
      relatedEvidence: "Provas Relacionadas",
      relatedLocations: "Locais Relacionados",
    },
    nav: {
      dashboard: "Painel",
      evidence: "Provas",
      timeline: "Cronologia",
      board: "Quadro",
      report: "Relatório",
    },
    home: {
      heroAlt: "Porto com nevoeiro durante a noite",
      caseLabel: "Caso 01: O Desaparecimento de Vale",
      titleLineOne: "O mar guardou o som.",
      titleLineTwo: "A vila enterrou o resto.",
      summary:
        "Mara Vale desapareceu dias antes de expor fraude de segurança ligada à Blackwake Energy. O jogador analisa provas, encontra contradições e decide se a verdade aponta para um encobrimento, um desaparecimento encenado ou uma morte escondida pela própria vila.",
      enterInvestigation: "Entrar na Investigação",
      reviewEvidenceVault: "Ver Arquivo de Provas",
      subjectFile: "Ficha do Sujeito",
      subjectNote: "Investigadora. Vista pela última vez junto à estrada de serviço do porto.",
      currentBuild: "Estado Atual",
      casePremise: "Premissa do Caso",
      premiseText:
        "Os registos das turbinas da Blackwake não correspondem aos danos ecológicos no canal do porto. Mara copiou algo que provava intenção. Nunca chegou a publicar.",
      modules: [
        "Arquivo de provas com leitura em camadas",
        "Quadro de investigação interativo para ligações e notas",
        "Reconstrução cronológica com contradições",
        "Relatório final com avaliação de causa, motivo e responsabilidade",
      ],
      caseStats: [
        { label: "Itens de Prova", value: "20" },
        { label: "Entidades-Chave", value: "10" },
        { label: "Eventos na Cronologia", value: "14" },
        { label: "Teorias Principais", value: "3" },
      ],
    },
    dashboard: {
      brief: "Resumo da Investigação",
      evidenceItems: "Itens de prova",
      entitiesInPlay: "Entidades em jogo",
      timelineEvents: "Eventos da cronologia",
      primaryQuestion: "Pergunta Principal",
      unlockSummary: (count) =>
        `A estrutura de desbloqueio já está definida em ${count} regras. A app consegue agora apresentar o caso a partir de conteúdo carregado dos dados, em vez de strings fixas no código.`,
      recentLeads: "Pistas Recentes",
      evidenceByEscalation: "Provas por fase",
      openVault: "Abrir arquivo de provas",
      phase: "Fase",
      coreCast: "Elenco Central",
    },
    evidenceList: {
      tagline: "Arquivo pesquisável do conjunto de provas escritas para o caso.",
      heading: "Arquivo do caso",
      summary: (count) => `${count} itens distribuídos por quatro fases da investigação`,
    },
    evidenceDetail: {
      source: "Fonte",
      discoveryPhase: (phase) => `Fase de descoberta ${phase}`,
    },
    timeline: {
      tagline: "Reconstrução cronológica da investigação e da noite do desaparecimento.",
      heading: "Cronologia",
      certainty: "Certeza",
    },
    board: {
      tagline: "Quadro interativo de investigação alimentado pelo grafo do caso.",
      label: "Quadro de Investigação",
      heading: "Superfície de relações",
      description:
        "Esta primeira versão transforma o grafo narrativo do caso num quadro navegável. O passo seguinte é acrescentar notas persistidas, ligações manuais e estado de arrasto por sessão de investigação.",
      sessionState: "Estado da Sessão",
      sessionHelp: "Arrasta os nós para reorganizar o quadro. O layout fica guardado localmente.",
      addNote: "Adicionar Nota",
      addLinkLabel: "Etiqueta da Ligação",
      addLinkPlaceholder: "ligação manual",
      linkInstruction: "Arrasta do conector direito de um nó para o conector esquerdo de outro nó.",
      noteTextLabel: "Texto da Nota",
      noteMeta: "Nota Manual",
      newNoteTitle: "Nova nota",
      notePlaceholder: "Regista uma pista, contradição ou próximo passo...",
      noteCounter: (count) => `${count} notas manuais`,
      removeNote: "Remover Nota",
      startLink: "Ligar",
      linkingFrom: "A ligar de",
      linkReady: "Escolhe um cartão de destino para concluir a ligação.",
      duplicateLinkHelp: "Ligar os mesmos dois nós atualiza a ligação manual existente.",
      removeLink: "Remover ligação",
      zoomIn: "Aproximar",
      zoomOut: "Afastar",
      centerView: "Centrar vista",
      resetView: "Repor Vista",
      resetBoard: "Repor Quadro",
    },
    report: {
      tagline: "Relatório final estruturado e alinhado com os eixos de avaliação do caso.",
      heading: "Relatório Final",
      instructions:
        "Escolhe uma resposta para cada eixo para registar a tua teoria atual. As escolhas ficam guardadas localmente para este caso.",
      currentTheory: "Teoria Atual",
      pendingAnswer: "Ainda não existe uma conclusão selecionada.",
      axisPending: "Por fechar",
      axisLocked: "Escolhido",
      completion: (completed, total) => `${completed}/${total} eixos preenchidos`,
      reset: "Limpar Teoria",
      bestCaseAnswer: "Melhor Resposta Possível",
      axes: {
        cause: "Causa",
        responsibility: "Responsabilidade",
        motive: "Motivo",
      },
      answers: {
        cause: [
          "Queda acidental",
          "Homicídio premeditado",
          "Suicídio",
          "Desaparecimento encenado",
        ],
        responsibility: [
          "Só Tomas",
          "Só Blackwake",
          "Encobrimento partilhado",
          "Desconhecido",
        ],
        motive: [
          "Conflito pessoal",
          "Escândalo de segurança",
          "Pânico financeiro",
          "Corrupção política",
        ],
      },
      bestCase: {
        cause: "Causa: queda acidental durante um confronto coercivo.",
        responsibility: "Responsabilidade: encobrimento partilhado por Pike, Tomas e Elena.",
        motive: "Motivo: ocultar o escândalo de segurança da turbina.",
      },
    },
    entity: {
      subjectFile: "Ficha do Sujeito",
      evidenceLinks: (count) => `${count} ligações a provas`,
      locationLinks: (count) => `${count} ligações a locais`,
      dossier: "Dossiê de investigação",
      publicNotes: "Notas Públicas",
      hiddenNotes: "Notas Ocultas",
    },
    typeLabels: {
      entity: {
        person: "pessoa",
        organization: "organização",
        location: "local",
        object: "objeto",
      },
      evidence: {
        note: "nota",
        photo: "fotografia",
        message: "mensagem",
        report: "relatório",
        transcript: "transcrição",
        audio: "áudio",
        log: "registo",
      },
      certainty: {
        high: "alta",
        medium: "média",
        low: "baixa",
      },
    },
  },
};

export function getDictionary(locale: AppLocale) {
  return dictionaries[locale];
}

export function getEntityTypeLabel(locale: AppLocale, type: string) {
  return dictionaries[locale].typeLabels.entity[type] ?? type;
}

export function getEvidenceTypeLabel(locale: AppLocale, type: string) {
  return dictionaries[locale].typeLabels.evidence[type] ?? type;
}

export function getCertaintyLabel(locale: AppLocale, certainty: string) {
  return dictionaries[locale].typeLabels.certainty[certainty] ?? certainty;
}
