export const en = {
  brand: {
    name: 'ORBIS',
    tagline: 'AI Production Intelligence'
  },
  shell: {
    search: 'Search orders, tanks...',
    language: 'Language',
    mobileShift: 'Shift A',
    userMeta: '30 Oct 2026 · Shift A',
    toggleNav: 'Toggle navigation'
  },
  lang: {
    en: 'EN',
    id: 'ID'
  },
  nav: {
    group: {
      operations: 'Operations',
      traceability: 'Traceability',
      system: 'System'
    },
    module: {
      dashboard: 'Dashboard',
      'ai-intelligence': 'AI Intelligence',
      'production-planning': 'Production Planning',
      'incoming-tanker': 'Incoming Tanker',
      'data-management': 'Data Management',
      traceability: 'Traceability',
      'quality-investigation': 'Quality Investigation',
      'audit-trail': 'Audit Trail',
      settings: 'Settings'
    },
    page: {
      dashboard: 'Dashboard',
      settings: 'Settings',
      'production-planning': 'Plan',
      'ai-recommendation': 'AI recommendation',
      'schedule-simulation': 'Simulation',
      'planning-approval': 'Approval',
      'planning-rejection': 'Rejection',
      'ai-prediction-detail': 'Prediction detail',
      'ai-production-risk': 'Production risk',
      'prediction-insufficient': 'Insufficient data',
      'tanker-overview': 'Overview',
      'tanker-detail': 'Tanker detail',
      'tanker-lab-status': 'Lab status',
      'tanker-unloading': 'Unloading',
      'tanker-lab-pending': 'Lab pending',
      'tanker-delayed': 'Delayed',
      'data-management-overview': 'Overview',
      'data-management-upload': 'Upload',
      'data-management-mapping': 'Column mapping',
      'data-management-validation': 'Validation',
      'data-management-preview': 'Preview',
      'data-management-history': 'History',
      'data-management-error': 'Import error',
      'data-management-mapping-review': 'Mapping review',
      'traceability-overview': 'Overview',
      'traceability-graph': 'Relationship graph',
      'traceability-forward': 'Forward trace',
      'traceability-backward': 'Backward trace',
      'traceability-batch': 'Batch detail',
      'quality-investigation-overview': 'Overview',
      'quality-investigation-detail': 'Investigation detail',
      'affected-batch-analysis': 'Affected batches',
      'affected-products': 'Affected products',
      'audit-trail-overview': 'Overview',
      'audit-event-detail': 'Event detail',
      'audit-integrity-check': 'Integrity check'
    },
    meta: {
      'ai-intelligence': 'Model refreshed',
      'production-planning': 'Plan horizon',
      'incoming-tanker': 'ETA feed',
      traceability: 'Last ledger check',
      'audit-trail': 'Last ledger check'
    }
  },
  status: {
    recorded: 'Recorded',
    verified: 'Verified',
    'hash verified': 'Hash verified',
    mismatch: 'Mismatch',
    match: 'Match',
    'integrity match': 'Integrity match',
    'not recorded': 'Not recorded',
    ready: 'Ready',
    pending: 'Pending',
    review: 'Review',
    'in review': 'In review',
    validated: 'Validated',
    valid: 'Valid',
    approved: 'Approved',
    completed: 'Completed',
    complete: 'Complete',
    imported: 'Imported',
    success: 'Success',
    passed: 'Passed',
    pass: 'Pass',
    rejected: 'Rejected',
    failed: 'Failed',
    error: 'Error',
    invalid: 'Invalid',
    critical: 'Critical',
    high: 'High',
    medium: 'Medium',
    warning: 'Warning',
    low: 'Low',
    open: 'Open',
    investigating: 'Investigating',
    'under investigation': 'Under investigation',
    'potentially affected': 'Potentially affected',
    'potential impact': 'Potential impact',
    confirmed: 'Confirmed',
    hold: 'Hold',
    'on hold': 'On hold',
    closed: 'Closed',
    'in progress': 'In progress',
    running: 'Running',
    draft: 'Draft',
    insufficient: 'Insufficient',
    'needs review': 'Needs review',
    active: 'Active',
    'on the way': 'On the way',
    arrived: 'Arrived',
    sampling: 'Sampling',
    'lab test': 'Lab test',
    'lab pending': 'Lab pending',
    receiving: 'Receiving',
    released: 'Released',
    unloading: 'Unloading',
    stored: 'Stored',
    delayed: 'Delayed',
    'insufficient data': 'Insufficient data'
  },
  common: {
    returnToWorkflow: 'Return to workflow',
    export: 'Export',
    downloadCsv: 'Download CSV',
    syntheticReview: 'Synthetic Demo Data · human review required where indicated'
  },
  schedule: {
    plain: 'Plain (Full Cream)',
    flavoured: 'Flavoured',
    changeover: 'Changeover',
    cip: 'CIP'
  },
  pages: {
    dashboard: {
      title: 'Dashboard',
      description: 'Plant-wide summary across planning and traceability',
      emptyTitle: 'Dashboard is coming soon',
      emptyDescription: 'Use Production Planning or Traceability to explore the prototype flow.',
      emptyAction: 'Open Production Planning'
    },
    settings: {
      title: 'Settings',
      description: 'Workspace, shift and integration preferences',
      emptyTitle: 'Settings are coming soon',
      emptyDescription: 'This prototype runs on synthetic operational data only.'
    },
    'production-planning': {
      title: 'Production plan',
      description: 'AI-assisted scheduling for raw milk, tanks, and filling lines',
      uploadOrders: 'Upload orders',
      aiRecommendation: 'AI recommendation',
      shiftKpis: 'Shift KPIs',
      shiftKpisSubtitle: 'Snapshot at 06:00 opening stock · Shift A',
      availableRawMilk: 'Available raw milk',
      vsYesterday: '+8.4% vs yesterday',
      plannedOrders: 'Planned orders',
      dueThisShift: '3 due this shift',
      tankUtilization: 'Tank utilization',
      withinRange: 'Within operating range',
      activeLines: 'Active lines',
      readyToRun: 'Ready to run',
      scheduleAlerts: 'Schedule alerts',
      needsReview: 'Needs review',
      shiftOutlook: 'Shift outlook',
      shiftOutlookSubtitle: 'AI forecast for the afternoon sequence',
      analysisReady: 'Analysis ready',
      predictedBottleneck: 'Predicted bottleneck',
      flavourDelayTitle: 'Flavour changeover may add 45 min',
      flavourDelayBody: 'to the afternoon sequence.',
      recommendation: 'Recommendation: run Full Cream before Strawberry',
      confidenceNote: 'Confidence is model output — validate constraints before approval.',
      productionSchedule: 'Production schedule',
      scheduleSubtitle: 'Today · 07:00–19:00',
      openSimulation: 'Open simulation',
      filling1: 'Filling Machine 1',
      filling2: 'Filling Machine 2',
      changeover: 'Changeover',
      operationalStatus: 'Operational status',
      rawMilkAvailability: 'Raw milk availability',
      machineReadiness: 'Machine readiness',
      machineReadyValue: 'Filling 1 + Filling 2',
      reviewItems: '2 review items',
      alertChangeoverTitle: 'Changeover window is 45 min',
      alertChangeoverDetail: 'Strawberry → Full Cream on Filling Machine 1 needs CIP_FLAVOUR',
      alertAtTitle: 'AT-02 threshold validated at 52.5%',
      alertAtDetail: 'Two fillers allowed above the 50% minimum level',
      syntheticNote: 'Synthetic data · Constraint rules shown separately from AI forecasts.'
    },
    'ai-recommendation': {
      title: 'AI recommendation',
      description: 'Review model output, validate constraints, then approve with confidence',
      compareSchedule: 'Compare schedule',
      reject: 'Reject',
      approve: 'Approve recommendation',
      eyebrow: 'Recommended sequence',
      recTitle: 'Move Full Cream 1L before Strawberry 1L',
      recDescription: 'Expected impact: recover 45 min · keep both filling lines active',
      pipeline: 'Decision pipeline',
      pipelineSubtitle: 'Each step must pass before the plan reaches the floor',
      why: 'Why this recommendation?'
    },
    'schedule-simulation': {
      title: 'Schedule simulation',
      description:
        'Corrected operational logic · the 45-minute changeover is preserved because product order is unchanged',
      approve: 'Approve alternative',
      scenario: 'Scenario result',
      scenarioSubtitle: 'Baseline vs valid alternative on Filling Machine 1',
      compare: 'Compare sequences',
      compareSubtitle: '07:00–14:00 · Filling Machine 1',
      optimization: 'Optimization result'
    },
    'planning-approval': {
      title: 'Plan approved',
      resultTitle: 'Alternative sequence approved; audit event EVT-1030-882 recorded',
      viewEvent: 'View audit event'
    },
    'planning-rejection': {
      title: 'Plan rejected',
      resultTitle: 'Alternative rejected; baseline schedule remains active'
    },
    'ai-prediction-detail': {
      title: 'Processing duration prediction',
      description: 'Synthetic prediction for B-2026-1030-01 · generated after TRK-045 delay signal',
      insufficient: 'View insufficient-data case',
      modelOutput: 'Model output',
      inputFactors: 'Input factors',
      historical: 'Historical comparison',
      historicalSubtitle: 'How the prediction compares with similar shifts'
    },
    'ai-production-risk': {
      title: 'Production risk analysis',
      description: 'Risks detected from the delayed tanker scenario'
    },
    'prediction-insufficient': {
      title: 'Prediction unavailable',
      resultTitle: 'Not enough data to generate a reliable prediction',
      returnToPrediction: 'Return to prediction',
      uploadData: 'Upload operational data'
    },
    'tanker-overview': {
      title: 'Incoming tanker monitoring',
      description: 'Monitor raw milk availability from farm through storage',
      today: 'Today',
      todaySubtitle: 'Raw milk intake · 06:00–06:00 period',
      queue: 'Tanker queue',
      queueSubtitle: 'Select a tanker to follow it through lab and unloading'
    },
    'tanker-detail': {
      title: 'Tanker TRK-042',
      description: 'Farm Cooperative A · Synthetic Demo Data',
      openLab: 'Open lab status',
      delivery: 'Delivery',
      timeline: 'Process timeline',
      timelineSubtitle: 'Farm to storage, 7 checkpoints'
    },
    'tanker-lab-status': {
      title: 'Sampling & lab status',
      description: 'Quality release remains human-controlled',
      pendingCase: 'Open pending case',
      recordResult: 'Record result',
      sample: 'Sample S-042-01',
      labInProgress: 'Lab test in progress',
      release: 'Release decision'
    },
    'tanker-unloading': {
      title: 'Unloading detail',
      description: 'Track transfer into destination storage tank',
      progress: 'Transfer progress',
      progressBadge: '60% complete',
      events: 'Unloading events',
      eventsSubtitle: 'Each event is hashed into the audit ledger'
    },
    'tanker-lab-pending': {
      title: 'Lab result pending',
      resultTitle: 'Lab result pending · release decision unavailable'
    },
    'tanker-delayed': {
      title: 'Tanker TRK-045',
      resultTitle: 'TRK-045 delayed by 35 minutes · ETA 12:15',
      openRisk: 'Open production risk'
    },
    'data-management-overview': {
      title: 'Data Management',
      description: 'Governed ingestion and validation for operational production data',
      upload: 'Upload file',
      tools: 'Ingestion tools',
      importLog: 'Import log',
      importLogSubtitle: 'Latest files ingested into the operational store'
    },
    'data-management-upload': {
      title: 'Upload operational data',
      description: 'AI analyzes structure before records are imported',
      analyze: 'Analyze file',
      file: 'File',
      before: 'Before you import',
      templates: 'Available templates',
      templatesSubtitle: 'Download a template, fill it in Excel, then upload it above'
    },
    'data-management-mapping': {
      title: 'Review AI column mapping',
      description: 'Low-confidence mappings require human review',
      continue: 'Continue to validation',
      reviewKeterangan: 'Review Keterangan'
    },
    'data-management-validation': {
      title: 'Validate records',
      description: 'Validation separates structural errors from records needing review',
      preview: 'Open import preview',
      summary: 'Validation summary',
      issues: 'Issues',
      issuesSubtitle: 'Records flagged during schema and business-rule checks'
    },
    'data-management-preview': {
      title: 'Import preview',
      description: 'Confirm records and event ledger before import',
      ready: 'Ready for confirmation',
      confirm: 'Confirm import',
      records: 'Records to import',
      recordsSubtitle: 'First 4 of 1,248 records'
    },
    'data-management-history': {
      title: 'Import history',
      description: 'Track who imported data and how validation performed',
      imports: 'Imports',
      importsSubtitle: 'Every import is recorded as an audit event',
      viewError: 'View failed import'
    },
    'data-management-error': {
      title: 'Import failed',
      resultTitle: 'Import failed: 20 records contain blocking schema errors'
    },
    'data-management-mapping-review': {
      title: 'Mapping review',
      resultTitle: 'Manual review required for Keterangan → unmapped',
      returnToMapping: 'Return to mapping'
    },
    'traceability-overview': {
      title: 'Traceability overview',
      relationshipGraph: 'Relationship graph',
      quickStats: 'Quick stats',
      quickStatsSubtitle: 'Graph-based material relationships from farm to finished goods',
      tools: 'Trace tools',
      relationships: 'Relationships',
      awaiting: 'awaiting confirmation',
      needsQa: 'needs QA review',
      matchesProof: 'matches blockchain proof'
    },
    'traceability-graph': {
      title: 'Material relationship graph',
      description: 'Directed relationships with event and quantity context',
      selected: 'Selected node',
      openBatch: 'Open batch detail'
    },
    'traceability-forward': {
      title: 'Forward trace · TRK-042',
      description: 'Source tanker → storage tank → production batch → finished goods',
      impact: 'Impact summary',
      impactSubtitle: 'Everything downstream of the selected tanker',
      path: 'Trace path',
      steps: 'Trace steps'
    },
    'traceability-backward': {
      title: 'Backward trace · FG-1030-01',
      description: 'Finished goods → production batch → tank → source tanker',
      origin: 'Origin summary',
      originSubtitle: 'Where the selected finished lot came from',
      path: 'Trace path',
      steps: 'Trace steps'
    },
    'traceability-batch': {
      title: 'Batch B-2026-1030-01',
      description: 'Production date 30 Oct · synthetic relationship record',
      ledgerPending: 'Ledger pending',
      openGraph: 'Open relationship graph',
      facts: 'Batch facts',
      relationships: 'Trace relationships',
      openBackward: 'Open backward trace'
    },
    'quality-investigation-overview': {
      title: 'Quality investigation',
      description: 'Use traceability to separate confirmed and potential impact',
      newInvestigation: 'New investigation',
      summary: 'Summary',
      investigations: 'Investigations'
    },
    'quality-investigation-detail': {
      title: 'Investigation QI-2026-014',
      description: 'Lab result review · Synthetic Demo Data',
      openAnalysis: 'Affected batch analysis',
      affectedProducts: 'Affected products',
      tracePath: 'Trace path',
      tracePathSubtitle: 'Backward and forward from the lab sample',
      findings: 'Traceability findings'
    },
    'affected-batch-analysis': {
      title: 'Affected batch analysis',
      description: 'Forward and backward trace results for human review',
      results: 'Trace results',
      resultsSubtitle: 'QI-2026-014 · 4 linked entities'
    },
    'affected-products': {
      title: 'Affected products',
      resultTitle: 'Potentially affected: B-2026-1030-01 → FG-1030-01',
      openForward: 'Open forward trace'
    },
    'audit-trail-overview': {
      title: 'Audit trail',
      description: 'Supporting integrity evidence for operational records',
      integrity: 'Run integrity check',
      health: 'Ledger health',
      recent: 'Recent events'
    },
    'audit-event-detail': {
      title: 'Event EVT-1030-882',
      description: 'Schedule approval event · supporting integrity evidence',
      verifiedCount: '8/8 verified',
      integrity: 'Integrity check',
      record: 'Event record'
    },
    'audit-integrity-check': {
      title: 'Integrity check',
      description: 'Compare operational references with integrity evidence',
      compared: 'Compared references'
    }
  }
} as const

type DeepString<T> = T extends string ? string : { [K in keyof T]: DeepString<T[K]> }
export type Messages = DeepString<typeof en>
