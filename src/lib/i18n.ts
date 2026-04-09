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
    reportStatus: string;
    openReport: string;
    openEnding: string;
    archiveReview: string;
    reportUnlocked: string;
    reportLocked: (missing: number) => string;
    caseStatus: string;
    caseOpen: string;
    caseClosed: string;
    caseStillOpen: string;
    reportScore: (score: number, total: number) => string;
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
    finalReportUnlock: string;
    unlockReady: string;
    unlockBlocked: (missing: number) => string;
    archiveProgress: (reviewed: number, total: number) => string;
    pendingAnswer: string;
    axisPending: string;
    axisLocked: string;
    completion: (completed: number, total: number) => string;
    scoreLabel: (score: number, total: number) => string;
    reset: string;
    submit: string;
    viewEnding: string;
    caseClosed: string;
    verdictPerfect: string;
    verdictStrong: string;
    verdictWeak: string;
    endingTitle: string;
    endingSummary: string;
    submittedAt: (value: string) => string;
    evidenceReview: string;
    supportingEvidence: string;
    conflictingEvidence: string;
    stillMissing: string;
    moreEvidence: (count: number) => string;
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
  ending: {
    tagline: string;
    heading: string;
    unavailableTitle: string;
    unavailableCopy: string;
    finalTheory: string;
    evidenceTrail: string;
    nextSteps: string;
    returnToReport: string;
    returnToDashboard: string;
    revisitEvidence: string;
    epiloguePerfect: string;
    epilogueStrong: string;
    epilogueWeak: string;
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
        "Final report builder across cause, motive, and responsibility",
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
      reportStatus: "Report Status",
      openReport: "Open report",
      openEnding: "Open ending",
      archiveReview: "Archive Review",
      reportUnlocked: "The final report is unlocked and ready to submit.",
      reportLocked: (missing) =>
        `${missing} required file${missing === 1 ? "" : "s"} still need review before the case can be closed.`,
      caseStatus: "Case Status",
      caseOpen: "Open",
      caseClosed: "Closed",
      caseStillOpen: "The final report has not been submitted yet.",
      reportScore: (score, total) => `Submitted verdict score: ${score}/${total}`,
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
      sessionHelp:
        "Drag nodes to reorganize the case board. Layout now syncs to your anonymous investigation session.",
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
      tagline: "Structured final report builder aligned with the authored theory axes.",
      heading: "Final Report",
      instructions:
        "Choose one answer for each axis to capture your current theory. Selections are stored locally for this case.",
      currentTheory: "Current Theory",
      finalReportUnlock: "Final Report Unlock",
      unlockReady: "The full case archive has been reviewed. The final report can now be submitted.",
      unlockBlocked: (missing) =>
        `Review the remaining evidence before closing the case. ${missing} file${missing === 1 ? "" : "s"} still missing.`,
      archiveProgress: (reviewed, total) => `${reviewed}/${total} required files reviewed`,
      pendingAnswer: "No conclusion selected yet.",
      axisPending: "Open",
      axisLocked: "Selected",
      completion: (completed, total) => `${completed}/${total} axes filled`,
      scoreLabel: (score, total) => `${score}/${total} best-case matches`,
      reset: "Reset Theory",
      submit: "Submit Report",
      viewEnding: "View Ending",
      caseClosed: "Case Closed",
      verdictPerfect: "The final theory fully matches the strongest supported case.",
      verdictStrong: "The final theory is close, but one axis still diverges from the strongest case.",
      verdictWeak: "The final theory closes the case, but it still conflicts with key evidence.",
      endingTitle: "The archive is sealed. The case now rests on your final reading.",
      endingSummary: "Final theory submitted.",
      submittedAt: (value) => `Submitted ${value}`,
      evidenceReview: "Evidence Review",
      supportingEvidence: "Supporting evidence",
      conflictingEvidence: "Conflicting evidence",
      stillMissing: "Still Missing",
      moreEvidence: (count) => `+${count} more`,
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
    ending: {
      tagline: "Dedicated closing screen for the final theory, verdict, and aftermath of the case.",
      heading: "Case Ending",
      unavailableTitle: "The ending is not available yet.",
      unavailableCopy:
        "Submit the final report first. Once the case is closed, this screen becomes the formal ending and epilogue for your investigation.",
      finalTheory: "Final Theory",
      evidenceTrail: "Evidence Trail",
      nextSteps: "Next Steps",
      returnToReport: "Return to report",
      returnToDashboard: "Return to dashboard",
      revisitEvidence: "Revisit evidence",
      epiloguePerfect:
        "Your reading closes the case with unusual clarity. The town keeps its silence, but the record now points cleanly to the confrontation, the fall, and the layered cover-up that followed.",
      epilogueStrong:
        "The case is closed, but not without residue. Your final reading captures the shape of the truth even if one part of the story remains slightly out of line with the strongest evidence.",
      epilogueWeak:
        "The case is technically closed, but the archive resists a neat ending. Your report settles the investigation while leaving visible tension between the chosen theory and the supporting record.",
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
        "Construtor de relatório final por causa, motivo e responsabilidade",
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
      reportStatus: "Estado do Relatório",
      openReport: "Abrir relatório",
      openEnding: "Abrir final",
      archiveReview: "Revisão do Arquivo",
      reportUnlocked: "O relatório final está desbloqueado e pronto a submeter.",
      reportLocked: (missing) =>
        `Ainda faltam rever ${missing} ficheiro${missing === 1 ? "" : "s"} obrigatório${missing === 1 ? "" : "s"} antes de encerrar o caso.`,
      caseStatus: "Estado do Caso",
      caseOpen: "Aberto",
      caseClosed: "Encerrado",
      caseStillOpen: "O relatório final ainda não foi submetido.",
      reportScore: (score, total) => `Pontuação do veredicto submetido: ${score}/${total}`,
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
      sessionHelp:
        "Arrasta os nós para reorganizar o quadro. O layout sincroniza com a tua sessão anónima de investigação.",
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
      tagline: "Construtor de relatório final estruturado e alinhado com os eixos da teoria do caso.",
      heading: "Relatório Final",
      instructions:
        "Escolhe uma resposta para cada eixo para registar a tua teoria atual. As escolhas ficam guardadas localmente para este caso.",
      currentTheory: "Teoria Atual",
      finalReportUnlock: "Desbloqueio do Relatório Final",
      unlockReady: "O arquivo completo do caso já foi revisto. O relatório final pode agora ser submetido.",
      unlockBlocked: (missing) =>
        `Revê as provas que faltam antes de encerrar o caso. Ainda faltam ${missing} ficheiro${missing === 1 ? "" : "s"}.`,
      archiveProgress: (reviewed, total) => `${reviewed}/${total} ficheiros obrigatórios revistos`,
      pendingAnswer: "Ainda não existe uma conclusão selecionada.",
      axisPending: "Por fechar",
      axisLocked: "Escolhido",
      completion: (completed, total) => `${completed}/${total} eixos preenchidos`,
      scoreLabel: (score, total) => `${score}/${total} correspondências com a melhor hipótese`,
      reset: "Limpar Teoria",
      submit: "Submeter Relatório",
      viewEnding: "Ver Final",
      caseClosed: "Caso Encerrado",
      verdictPerfect: "A teoria final coincide totalmente com a hipótese mais bem suportada.",
      verdictStrong: "A teoria final está muito próxima, mas um eixo ainda diverge da hipótese mais forte.",
      verdictWeak: "A teoria final encerra o caso, mas continua em conflito com provas importantes.",
      endingTitle: "O arquivo fica selado. O caso passa agora a viver na tua leitura final.",
      endingSummary: "Teoria final submetida.",
      submittedAt: (value) => `Submetido ${value}`,
      evidenceReview: "Leitura das Provas",
      supportingEvidence: "Provas de suporte",
      conflictingEvidence: "Provas em conflito",
      stillMissing: "Ainda em Falta",
      moreEvidence: (count) => `+${count} mais`,
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
    ending: {
      tagline: "Ecrã dedicado para o fecho do caso, veredicto final e consequências da investigação.",
      heading: "Final do Caso",
      unavailableTitle: "O final ainda não está disponível.",
      unavailableCopy:
        "Submete primeiro o relatório final. Depois de o caso ser encerrado, este ecrã passa a funcionar como final formal e epílogo da investigação.",
      finalTheory: "Teoria Final",
      evidenceTrail: "Rasto de Provas",
      nextSteps: "Próximos Passos",
      returnToReport: "Voltar ao relatório",
      returnToDashboard: "Voltar ao painel",
      revisitEvidence: "Rever provas",
      epiloguePerfect:
        "A tua leitura encerra o caso com invulgar clareza. A vila continua em silêncio, mas o registo passa a apontar de forma limpa para o confronto, a queda e o encobrimento em camadas que se seguiu.",
      epilogueStrong:
        "O caso fica encerrado, mas não sem resíduos. A tua leitura final capta a forma da verdade, mesmo que uma parte da história continue ligeiramente desalinhada da prova mais forte.",
      epilogueWeak:
        "O caso fica tecnicamente encerrado, mas o arquivo resiste a um final limpo. O teu relatório resolve a investigação enquanto deixa visível a tensão entre a teoria escolhida e o registo que a sustenta.",
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
