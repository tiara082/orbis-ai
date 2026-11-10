export const en = {
  brand: {
    name: 'ORBIS',
    tagline: 'Production Intelligence'
  },
  shell: {
    search: 'Search menus and tabs...',
    language: 'Language',
    toggleNav: 'Toggle navigation',
    collapse: 'Collapse sidebar',
    expand: 'Expand sidebar',
    notifications: 'Alerts',
    markAllRead: 'Mark all read',
    noAlerts: 'No alerts right now',
    timezone: 'WIB',
    profileMenu: 'Account menu',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Log out',
    role: 'Production planner',
    plant: 'Dairy plant · ESL & UHT',
    shift: 'Shift A',
    signIn: 'Sign in',
    guide: 'User guide'
  },
  alerts: {
    approval: {
      title: 'Plan waiting for approval',
      body: 'A generated plan revision needs a human decision before it becomes active'
    }
  },
  lang: {
    en: 'EN',
    id: 'ID'
  },
  source: {
    scenario: 'Demo scenario · {date} · snapshot {time}',
    catalog: 'Official catalog · {count} CSV files',
    scenarioNote: 'Synthetic demo data · IDs from the official catalog'
  },
  nav: {
    group: {
      monitor: 'Monitor',
      operations: 'Operations',
      planning: 'Planning',
      system: 'System'
    },
    module: {
      dashboard: 'Dashboard',
      'operational-data': 'Operational Data',
      'milk-traceability': 'Milk Traceability',
      'ai-planning': 'AI Production Planning',
      'production-schedule': 'Production Schedule',
      'master-data': 'Master Data & Settings',
      account: 'Account',
      guide: 'User guide'
    },
    moduleInfo: {
      dashboard: {
        title: 'Dashboard',
        description: 'Today at a glance: milk received, plan, alerts, and traceability'
      },
      guide: {
        title: 'ORBIS user guide',
        description: 'Language setup, AI production planning, and graph-based milk traceability step by step'
      }
    },
    tab: {
      'operational-data': {
        delivery: {
          label: 'Delivery',
          title: 'Farm & milk delivery',
          description: 'Tanker departure, ETA, arrival, delay, and unloading per truck'
        },
        'lab-release': {
          label: 'Receiving & QC',
          title: 'Sampling, lab test & release',
          description: 'Unloading starts only after QA releases the tanker (RECEIVING_GATE)'
        },
        'unloading-bay': {
          label: 'Unloading bay',
          title: 'Unloading bays',
          description: 'Bay availability, pump rate, unloading duration, and CIP between tankers'
        },
        'raw-milk-process': {
          label: 'Raw milk & process',
          title: 'Raw milk tanks & process machines',
          description: 'Raw milk tanks, degassing, thermizers, separators, cream and mixing tanks'
        },
        'sfp-storage': {
          label: 'Storage tank (SFP)',
          title: 'SFP storage tanks',
          description: '15 storage tanks with level, flows, holding time, and CIP status'
        },
        'aseptic-tank': {
          label: 'Sterilizer & aseptic',
          title: 'Sterilizers & aseptic tanks',
          description: 'Aseptic tank levels against the dynamic minimum level for one or two fillers'
        },
        'production-order': {
          label: 'Production order',
          title: 'Production orders',
          description: 'Orders with volume, milk requirement, priority, due time, and eligible lines'
        },
        'production-actual': {
          label: 'Production actual',
          title: 'Production actuals',
          description: 'Recorded output per order and filling line status'
        }
      },
      'milk-traceability': {
        batches: {
          label: 'Batches',
          title: 'Batches',
          description: 'Every batch from tanker to finished goods, with mass balance per batch'
        },
        'batch-detail': {
          label: 'Batch detail',
          title: 'Batch detail & blockchain verification',
          description: 'Batch facts, genealogy relationships, material allocation, and ledger integrity verification'
        },
        transfers: {
          label: 'Transfer history',
          title: 'Transfer history',
          description: 'Each transfer records source, destination, time, volume, and route'
        },
        graph: {
          label: 'Relationship graph',
          title: 'Relationship graph',
          description: 'Genealogy from farm to finished goods, including splits and mixes'
        },
        backward: {
          label: 'Backward trace',
          title: 'Backward trace',
          description: 'From a product batch back to the tankers and farms it came from'
        },
        forward: {
          label: 'Forward trace',
          title: 'Forward trace',
          description: 'From a tanker or tank to every batch and finished good it reached'
        },
        'audit-log': {
          label: 'Audit log',
          title: 'Audit log',
          description: 'Who did what and when, including plan generation and approval'
        }
      },
      'ai-planning': {
        forecasting: {
          label: 'Forecasting',
          title: 'Forecast & planning insights',
          description: 'Predicted milk availability, arrival times, and milk demand of the plan'
        },
        configuration: {
          label: 'Configuration',
          title: 'Planning configuration',
          description: 'Order quantities, line speed, changeover, and CIP durations used by the planner'
        },
        generate: {
          label: 'Generate plan',
          title: 'Generate plan',
          description: 'Preview the plan from the current configuration, check it, and send it for approval'
        },
        scenarios: {
          label: 'Scenarios',
          title: 'Scenarios',
          description: 'What-if alternatives evaluated against the same rules'
        },
        recommendations: {
          label: 'Recommendations',
          title: 'Recommendations',
          description: 'Recommended schedule, risks, and alternatives for each alert'
        }
      },
      'production-schedule': {
        recommended: {
          label: 'Recommended schedule',
          title: 'Recommended production schedule',
          description: 'Approved plan per filling line: production, changeover, and CIP'
        },
        calendar: {
          label: 'Calendar',
          title: 'Production calendar',
          description: 'Lines, aseptic tank, and maintenance windows across the day'
        },
        'machine-allocation': {
          label: 'Machine allocation',
          title: 'Machine allocation',
          description: 'Orders per filling line and the upstream machines that feed them'
        },
        'tank-allocation': {
          label: 'Tank allocation',
          title: 'Tank allocation',
          description: 'Which tank and batch feeds each order, and the aseptic tank sequence'
        },
        approval: {
          label: 'Approval',
          title: 'Plan approval',
          description: 'Review a generated revision and approve or reject it'
        },
        'planned-vs-actual': {
          label: 'Planned vs actual',
          title: 'Planned vs actual',
          description: 'Planned windows and quantities compared with recorded production'
        }
      },
      'master-data': {
        products: {
          label: 'Products & SKU',
          title: 'Products & SKU',
          description: 'Liquid SKUs, finished SKUs, pack sizes, and market variants'
        },
        assets: {
          label: 'Assets',
          title: 'Assets & parameters',
          description: 'Every plant asset with its catalog parameters and units'
        },
        routes: {
          label: 'Routes',
          title: 'Routes & connections',
          description: 'Allowed material routes between assets'
        },
        'line-eligibility': {
          label: 'Line eligibility',
          title: 'Filling line eligibility',
          description: 'Which SKU and pack size can run on each filling line'
        },
        rules: {
          label: 'Rules & assumptions',
          title: 'Rules & assumptions',
          description: 'Constraint catalog, changeover and CIP rules, and project assumptions'
        }
      },
      account: {
        profile: {
          label: 'Profile',
          title: 'Profile',
          description: 'Operator identity used on audit events'
        },
        settings: {
          label: 'Settings',
          title: 'Settings',
          description: 'Language, shift, and timezone'
        }
      }
    }
  },
  units: {
    min: 'min',
    h: 'h',
    hShort: 'h',
    packs: 'packs',
    packsPerHour: 'packs/h'
  },
  status: {
    ready: 'Ready',
    pending: 'Pending',
    'pending approval': 'Pending approval',
    approved: 'Approved',
    rejected: 'Rejected',
    superseded: 'Superseded',
    completed: 'Completed',
    running: 'Running',
    valid: 'Valid',
    invalid: 'Invalid',
    pass: 'Pass',
    warning: 'Warning',
    violation: 'Violation',
    'not computable': 'Not computable',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    late: 'Late',
    'on time': 'On time',
    'on the way': 'On the way',
    arrived: 'Arrived',
    'lab pending': 'Lab pending',
    passed: 'Passed',
    'within spec': 'Within spec',
    'awaiting result': 'Awaiting result',
    stored: 'Stored',
    'pending qa': 'Pending QA',
    released: 'Released',
    idle: 'Idle',
    available: 'Available',
    occupied: 'Occupied',
    inactive: 'Inactive',
    cip: 'CIP',
    'cip required': 'CIP required',
    maintenance: 'Maintenance',
    'holding risk': 'Holding risk',
    empty: 'Empty',
    eligible: 'Eligible',
    'not eligible': 'Not eligible',
    computed: 'Computed',
    reference: 'Reference'
  },
  common: {
    close: 'Close',
    all: 'All',
    today: 'Today',
    open: 'Open',
    details: 'Details'
  },
  table: {
    count: '{count} rows',
    countFiltered: '{shown} of {total} rows',
    search: 'Search...',
    empty: 'No rows match',
    previous: 'Previous page',
    next: 'Next page'
  },
  catalog: {
    pending: 'Value pending',
    pendingHint: 'Catalog marks this parameter X: it applies, the value is not provided yet',
    naHint: 'Catalog marks this parameter N/A: it does not apply to this asset'
  },
  col: {
    action: 'Action',
    active: 'Active',
    activeLines: 'Active lines',
    activity: 'Activity',
    actor: 'Actor',
    actualDuration: 'Actual duration',
    actualWindow: 'Actual',
    alert: 'Alert',
    allowedSkus: 'Allowed SKUs',
    appliesTo: 'Applies to',
    arrival: 'Arrival',
    asepticTank: 'Aseptic tank',
    asset: 'Asset',
    availability: 'Availability',
    batch: 'Batch',
    batchVolume: 'Batch volume',
    bay: 'Bay',
    capacity: 'Capacity',
    catalogDuration: 'Catalog duration',
    category: 'Category',
    changeoverTime: 'Changeover',
    cipDuration: 'CIP',
    cipTime: 'CIP',
    condition: 'Condition',
    connection: 'Connection',
    currentTanker: 'Current tanker',
    decided: 'Decided',
    decidedBy: 'Decided by',
    definition: 'Definition',
    delay: 'Delay',
    departure: 'Departure',
    description: 'Description',
    destination: 'Destination',
    due: 'Due',
    duration: 'Duration',
    eligible: 'Eligible',
    eligibleLines: 'Eligible lines',
    end: 'End',
    entity: 'Entity',
    estimatedDuration: 'Estimated',
    eta: 'ETA',
    event: 'Event',
    expectedByNow: 'Planned by {time}',
    family: 'Family',
    farm: 'Farm',
    feeds: 'Feeds',
    finish: 'Finish',
    finishedSku: 'Finished SKU',
    flavour: 'Flavour',
    flowType: 'Flow type',
    freeAt: 'Free at',
    from: 'From',
    fromBatch: 'From batch',
    generated: 'Generated',
    generatedBy: 'Generated by',
    goodPacks: 'Good packs',
    holding: 'Holding time',
    impact: 'Impact',
    implementation: 'In app',
    inflow: 'Inflow',
    keyIssue: 'Key issue',
    labDuration: 'Lab duration',
    labEnd: 'Lab end',
    labStart: 'Lab start',
    lastFinish: 'Last finish',
    lateOrders: 'Late orders',
    level: 'Level',
    line: 'Line',
    linesFed: 'Lines fed',
    liquidDraw: 'Liquid draw',
    liters: 'Liters',
    litersFromSource: 'Liters from source',
    litersInTarget: 'Liters in target',
    maintenance: 'Maintenance',
    market: 'Market',
    markets: 'Markets',
    massBalance: 'Mass balance',
    material: 'Material',
    maxFlow: 'Max flow',
    metric: 'Metric',
    milkBalance: 'Milk spare',
    milkContent: 'Milk content',
    milkNeed: 'Milk need',
    minLevel: 'Min level',
    name: 'Name',
    note: 'Note',
    order: 'Order',
    orders: 'Orders',
    outflow: 'Outflow',
    packs: 'Packs',
    packSize: 'Pack size',
    packSizes: 'Pack sizes',
    parameter: 'Parameter',
    pipe: 'Pipe',
    planned: 'Planned',
    plannedLiters: 'Planned liters',
    plannedPacks: 'Planned packs',
    plannedWindow: 'Planned',
    precedence: 'Precedence',
    predicted: 'Predicted',
    prediction: 'Prediction',
    priority: 'Priority',
    product: 'Product',
    productGroup: 'Product group',
    productionDate: 'Production date',
    productionTime: 'Production',
    progress: 'Progress',
    pumpFlow: 'Pump rate',
    qcResult: 'QC result',
    qcStatus: 'QC status',
    reason: 'Reason',
    recommendation: 'Recommendation',
    rejectPacks: 'Reject',
    releasedBy: 'Released by',
    releaseTime: 'Release time',
    requirement: 'Requirement',
    revision: 'Revision',
    role: 'Role',
    route: 'Route',
    routeCheck: 'Route check',
    rule: 'Rule',
    ruleCheck: 'Rule check',
    runTime: 'Run time',
    sample: 'Sample',
    sampling: 'Sampling',
    scenario: 'Scenario',
    scenarioDuration: 'Scenario value',
    scope: 'Scope',
    sentTo: 'Sent to',
    shareFromSource: 'Share from source',
    shareOfTarget: 'Share of target',
    sizeMl: 'Size (ml)',
    sku: 'Liquid SKU',
    source: 'Source',
    speed: 'Speed',
    speedPackph: 'Speed (packs/h)',
    stage: 'Stage',
    start: 'Start',
    startDeviation: 'Start deviation',
    status: 'Status',
    tank: 'Tank',
    tankersPerBay: 'Tankers per bay',
    time: 'Time',
    to: 'To',
    toBatch: 'To batch',
    transfer: 'Transfer',
    transferType: 'Type',
    trigger: 'Trigger',
    truck: 'Truck',
    truckCapacity: 'Truck capacity',
    type: 'Type',
    unit: 'Unit',
    unloadEnd: 'Unload end',
    unloading: 'Unloading',
    unloadStart: 'Unload start',
    unloadsToday: 'Unloads today',
    unloadVolume: 'Unloading volume',
    usedIn: 'Used in',
    utilization: 'Utilization',
    variance: 'Variance',
    via: 'Via',
    volume: 'Volume',
    volumeNow: 'Volume now',
    volumeToProcess: 'Volume to process',
    window: 'Window',
    yield: 'Yield',
    param: {
      capacity_l: 'Capacity',
      input_flow_lph: 'Input flow',
      output_flow_lph: 'Output flow',
      process_speed_lph: 'Process speed',
      holding_time_limit_hours: 'Holding limit',
      cip_duration_minutes: 'CIP',
      speed_packph: 'Filling speed'
    }
  },
  checks: {
    allPass: 'All rules pass',
    assumption: 'Project assumption',
    RECEIVING_GATE: {
      title: 'Receiving gate',
      early: '{tanker} started unloading before lab release',
      blocked: '{tanker} waits for lab release ({volumeL}); unloading stays blocked',
      pass: 'All {count} unloaded tankers were released by QA first'
    },
    BAY_EXCLUSIVE: {
      title: 'One tanker per bay',
      overlap: '{bay} served {tankerA} and {tankerB} at the same time',
      pass: '{count} unloads, no bay overlap'
    },
    CAPACITY: {
      title: 'Tank capacity',
      exceeded: '{asset} is below zero or above usable capacity',
      pass: '{count} tanks within capacity',
      incoming: 'Incoming {incomingL} exceeds empty raw milk tank capacity {emptyCapacityL}',
      incomingOk: 'Empty raw milk tanks can take the incoming {incomingL}'
    },
    CIP_EMPTY: {
      title: 'CIP before refill',
      beforeReceiving: '{asset} is empty and needs CIP before it can take the incoming {incomingL}'
    },
    HOLDING: {
      title: 'Holding time',
      expired: '{asset} is past its holding time limit',
      risk: '{asset} reaches its holding limit at {expiryTime} ({remainingMin} left)',
      pass: '{count} tanks within holding time'
    },
    LINE_PRODUCT: {
      title: 'Line eligibility',
      ineligible: '{sku} is not eligible on {line}',
      pass: 'All {count} production runs are on eligible lines'
    },
    AT_SAME_PRODUCT: {
      title: 'Same product on shared aseptic tank',
      conflict: '{at} would feed {lineA} and {lineB} at {startTime}',
      pass: 'Lines sharing an aseptic tank run the same product at the same time'
    },
    AT_SHARED_FLOW: {
      title: 'Aseptic tank output limit',
      over: '{at} peak draw {peakLph} exceeds its output limit {limitLph}',
      pass: '{at} peak draw {peakLph} within limit {limitLph}'
    },
    SIMULTANEOUS: {
      title: 'Aseptic tank minimum level',
      minLevel: '{at} is ready at {readyTime} after CIP and refill to {minPct}%; filling planned at {startTime} starts {lateMin} late',
      pass: 'Aseptic tank reaches minimum level before every product switch'
    },
    CHANGEOVER_PRECEDENCE: {
      title: 'Changeover precedence',
      pass: 'Changeovers follow Variant > Size > Paper: {list}'
    },
    CIP_END_PRODUCTION: {
      title: 'CIP at end of production',
      pass: '{count} CIP blocks scheduled'
    },
    FILLING_SPEED_UNIT: {
      title: 'Filling speed unit',
      empty: 'No production to convert',
      pass: '{line} draws {drawLph} (packs/h × pack ml ÷ 1000)'
    },
    PLAN: {
      title: 'Due time',
      late: '{order} finishes {lateMin} after its due time {dueTime}',
      pass: 'All {count} orders finish before their due time'
    },
    MILK_BALANCE: {
      title: 'Milk balance',
      short: 'Plan needs {requiredL}; only {availableL} released ({shortL} short)',
      pass: 'Plan needs {requiredL} of {availableL} released ({spareL} spare)'
    },
    HEADER_RESOURCE: {
      title: 'Header resource',
      missing: 'Parallel transfer count and shared header capacity are not in the catalog yet'
    },
    CATALOG_DURATIONS: {
      title: 'Catalog durations',
      scenario: 'Changeover and CIP durations are X in the catalog; the plan uses scenario values'
    }
  },
  schedule: {
    kind: {
      plain: 'Full Cream',
      flavoured: 'Flavoured',
      changeover: 'Changeover',
      cip: 'CIP',
      wait: 'Wait',
      maintenance: 'Maintenance',
      level: 'Refill to min level'
    },
    block: {
      production: 'Production',
      VARIANT: 'Variant changeover',
      SIZE: 'Size change',
      PAPER: 'Paper change',
      CIP: 'CIP',
      wait: 'Wait for aseptic tank',
      maintenance: 'Maintenance',
      CIP_EMPTY: 'CIP (empty tank)',
      refill: 'Refill'
    },
    asepticLane: 'Aseptic tank',
    lateBy: 'Late {time}',
    ordersFooter: '{count} orders · milk need {milk} · last block ends {end}',
    activeRevision: '{id} · approved {time}',
    pendingTitle: '{id} is waiting for approval',
    pendingBody: 'This page shows the approved plan until the new revision is approved.',
    timeline: 'Schedule per filling line',
    timelineHint: 'Approved plan · {start}–{end}',
    table: 'Production schedule',
    tableHint: 'Changeover, CIP, and maintenance are separate activities',
    orders: 'Order outcome',
    calendar: {
      day: 'Calendar · {date}',
      dayHint: 'Filling lines, aseptic tank sequence, and equipment maintenance',
      next: 'Next production day',
      nextHint: 'Orders already known for tomorrow'
    },
    machines: {
      lines: 'Filling lines',
      linesHint: 'Time per activity and utilization against the plan window',
      utilHint: 'Production time ÷ plan window {window}',
      upstream: 'Upstream machines',
      upstreamHint: 'Run time needed at rated speed to supply today’s plan',
      role: {
        sterilize: 'Sterilize to aseptic tank',
        thermize: 'Thermize raw milk',
        separate: 'Separate and standardize'
      }
    },
    tanks: {
      aseptic: 'Aseptic tank sequence',
      asepticHint: 'Product segments, CIP after emptying, and refill to minimum level',
      table: 'Tank & batch allocation',
      tableHint: 'Storage and aseptic batches feeding today’s orders'
    },
    approval: {
      reviewTitle: 'Review {id}',
      reviewHint: 'Generated by {by} at {time}',
      activeCol: 'Active {id}',
      pendingCol: 'Pending {id}',
      compare: {
        end: 'Last block ends',
        late: 'Late orders',
        milk: 'Milk need'
      },
      checks: 'Rule checks on this revision',
      decision: 'Decision',
      decisionHint: 'Approval makes this revision the active schedule. A rejection keeps the current one.',
      note: 'Note',
      notePlaceholder: 'Optional for approval, required for rejection',
      reasonRequired: 'Add a reason before rejecting',
      blocked: 'This revision has a rule violation; fix the configuration and generate again',
      approve: 'Approve plan',
      reject: 'Reject',
      approvedTitle: '{id} approved',
      approvedBody: 'The schedule, dashboard, and allocation pages now read this revision.',
      rejectedTitle: '{id} rejected',
      rejectedBody: '{active} stays the active schedule.',
      openSchedule: 'Open schedule',
      openAudit: 'Open audit log',
      emptyTitle: 'Nothing waiting for approval',
      emptyBody: '{id} is the active schedule. Generate a new plan to start a review.',
      emptyAction: 'Generate plan',
      history: 'Revision history'
    },
    pva: {
      planned: 'Planned',
      actual: 'Actual',
      timeline: 'Planned vs actual per line',
      timelineHint: 'Red outline marks a run with a recorded deviation',
      table: 'Per production run',
      tableHint: 'Expected packs scale with the elapsed share of the planned window'
    }
  },
  audit: {
    action: {
      labRelease: 'Lab release',
      transfer: 'Transfer',
      split: 'Split transfer',
      batchCreated: 'Batch created',
      coProduct: 'Co-product recorded',
      tankerArrived: 'Tanker arrived',
      cipStarted: 'CIP started',
      productionStarted: 'Production started',
      planGenerated: 'Plan generated',
      planApproved: 'Plan approved',
      planRejected: 'Plan rejected'
    }
  },
  dashboard: {
    greeting: 'Today’s production',
    kpi: {
      received: 'Milk received',
      receivedCaption: 'Released by QA and stored',
      available: 'Available for plan',
      availableCaption: '{spare} above plan milk need',
      waiting: 'Waiting',
      waitingCaption: '{pending} lab pending · {incoming} on the way',
      plan: 'Active plan',
      planApproved: 'Approved',
      planPending: '{id} waiting for approval'
    },
    plan: 'Today’s plan',
    planHint: '{id} · {start}–{end}',
    openSchedule: 'Open schedule',
    alerts: 'AI alerts',
    alertsHint: '{count} items from rule checks and planning',
    openRecommendations: 'Alternatives',
    pva: 'Planned vs actual',
    pvaGood: 'Good packs so far',
    pvaExpected: 'Planned by {time}',
    pvaCaption: '{pct}% of planned output for the elapsed time',
    trace: 'Traceability status',
    traceBatches: 'Batches recorded',
    traceTransfers: 'Transfers on listed routes',
    traceBalance: 'Batches in mass balance',
    tracePendingQa: 'Finished goods pending QA',
    openGraph: 'Open graph',
    assets: 'Tank & machine status',
    assetsHint: 'Snapshot at {time}',
    openOperational: 'Operational data',
    footer: 'AI output is labelled; rule checks come from the official constraint catalog. Synthetic demo data.'
  },
  master: {
    milkContentHint: 'Project assumption: Full Cream 100% milk, flavoured 90% milk',
    edit: {
      add: 'Add row',
      upload: 'Upload Excel',
      template: 'Template',
      save: 'Save',
      reset: 'Restore official catalog',
      formEyebrow: 'Input form',
      formHint: 'A row with the same ID replaces the existing one. Lists use a semicolon.',
      session: 'This master data differs from the official catalog. Changes stay in this browser session and feed the rest of the app.',
      result: '{added} added, {updated} updated, {skipped} skipped',
      noRows: 'The file has no data rows',
      headerMismatch: 'Missing columns: {columns}. Download the template and keep its header row.',
      required: 'Row {row}: {field} is required',
      notNumber: 'Row {row}: {field} must be a number',
      unreadable: 'The file could not be read. Use .xlsx or .csv.',
      yes: 'Yes',
      no: 'No'
    },
    products: {
      liquid: 'Liquid SKUs',
      liquidHint: 'Product families and flavours, with allowed pack sizes and markets',
      finished: 'Finished SKUs',
      finishedHint: 'Liquid SKU × pack size × market variant',
      packSizes: 'Pack sizes',
      markets: 'Market variants',
      marketsHint: 'Market variant is separate from flavour variant'
    },
    assets: {
      total: 'Assets',
      totalCaption: '{types} asset types',
      physical: 'Physical assets',
      physicalCaption: 'Machines, tanks, bays, pipes',
      logical: 'Logical nodes',
      logicalCaption: 'Headers and boundaries',
      pendingParams: 'Parameters pending',
      pendingCaption: 'Marked X in the catalog',
      table: 'Asset configuration',
      tableHint: '“Value pending” = parameter applies, value not provided · “—” = not applicable',
      allTypes: 'All types ({count})',
      units: 'Parameter units',
      unitsHint: 'Unit and meaning of each asset parameter',
      role: {
        process_asset: 'Process asset',
        physical_pipe: 'Dedicated pipe',
        logical_junction: 'Logical header',
        material_source: 'Farm boundary',
        delivery_source: 'Tanker boundary',
        finished_goods_sink: 'Finished goods boundary'
      }
    },
    routes: {
      table: 'Asset connections',
      tableHint: 'Material may move only along listed edges (CONNECTION)',
      allFlows: 'All flow types ({count})',
      search: 'Search asset or connection...',
      flow: {
        main_milk: 'Main milk',
        sterilized_product: 'Sterilized product',
        aseptic_supply: 'Aseptic supply',
        cream: 'Cream',
        mixed_product: 'Mixed product',
        premix: 'Premix',
        to_sterilization: 'To sterilization',
        finished_goods: 'Finished goods'
      }
    },
    lines: {
      dedication: 'Line dedication',
      dedicationHint: 'Select a line to see its SKU eligibility below',
      matrixFor: 'Eligibility for {line}',
      matrixHint: 'From line_product_compatibility and line_finished_sku_compatibility',
      onlyEligible: 'Eligible only',
      allRows: 'All rows',
      byProduct: 'Liquid SKU × pack size',
      byFinished: 'Finished SKU'
    },
    rules: {
      constraints: 'Constraint catalog',
      constraintsHint: '“Computed” rules are checked live in the app',
      changeover: 'Changeover Rules & Machine Downtime',
      changeoverHint: 'The system automatically calculates downtime when switching products after completing production',
      cip: 'CIP rules',
      cipHint: 'CIP is independent of changeover and can close several triggers in one cycle',
      assumptions: 'Project assumptions',
      assumptionsHint: 'Values agreed for this project; checks that use them are labelled',
      assumption: {
        density: { title: 'Density 1 kg/L', body: 'Liters and kilograms are interchangeable in all calculations.' },
        fullCream: { title: 'Full Cream 100% milk', body: 'Full Cream liquid is made entirely from fresh milk.' },
        flavoured: { title: 'Flavoured 90% milk', body: 'Chocolate and Strawberry use 90% milk; premix makes up the rest.' },
        packaging: { title: 'Packaging & warehouse', body: 'Packaging material and warehouse space are not constraints.' },
        maintenance: { title: 'Maintenance', body: 'Maintenance windows include trial runs and calibration.' },
        breakdown: { title: 'Breakdown', body: 'Unplanned stops are covered by the utilization percentage.' },
        batchPolicy: { title: '1 tank = 1 batch', body: 'Each tank holds one batch per production date.' },
        hold: { title: 'Hold', body: 'Batch hold and release follow the QA procedure.' }
      }
    }
  },
  ops: {
    scenarioNote: 'Synthetic demo data',
    snapshotAt: 'Snapshot at {time}',
    holdingHint: 'Age counted from batch start; refill does not reset it (HOLDING)',
    holdingLimit: 'Limit {hours} h',
    remaining: '{time} left',
    delivery: {
      trucks: 'Trucks today',
      trucksCaption: 'From {farms} farms',
      received: 'Received',
      receivedCaption: '{count} tankers unloaded',
      waiting: 'Not yet received',
      waitingCaption: '{pending} lab pending · {incoming} on the way',
      late: 'Late arrivals',
      lateCaption: 'Arrived after ETA',
      table: 'Deliveries',
      tableHint: 'Select a row for the delivery timeline and destination tanks',
      drawerEyebrow: 'Delivery',
      progress: 'Progress',
      details: 'Details',
      destinations: 'Destination tanks',
      noDestination: 'Not unloaded yet',
      splitNote: 'Split delivery: one tanker into two raw milk tanks, recorded as two transfers.',
      step: {
        departure: 'Departed',
        arrival: 'Arrived',
        lab: 'Lab release',
        unload: 'Unloaded',
        stored: 'Stored'
      }
    },
    lab: {
      table: 'Sampling & lab records',
      tableHint: 'QC status Pending, Passed, or Rejected'
    },
    bay: {
      table: 'Bays',
      tableHint: '{active} of {total} bays active · one tanker per bay at a time',
      maintenanceUntil: 'Maintenance until {time}',
      timeline: 'Bay timeline',
      timelineHint: 'Unloading, CIP after each tanker, waiting, and maintenance',
      unloadingBlock: 'Unloading',
      waitingBlock: 'Waiting for lab release',
      unloads: 'Unloading records',
      estimateHint: 'Volume ÷ pump rate'
    },
    raw: {
      tanks: 'Raw milk tanks',
      machines: 'Degassing, thermizers & separators',
      machinesHint: 'Rated speed, CIP duration, and maintenance window',
      intermediate: 'Cream, premix & mixing tanks',
      intermediateHint: 'Co-product cream and flavoured mixing'
    },
    sfp: {
      tanks: 'SFP tanks',
      tanksCaption: '{capacity} total capacity',
      inUse: 'In use',
      cip: 'CIP',
      holdingRisk: 'Holding risk',
      holdingCaption: 'Less than 3 h to limit',
      table: 'SFP storage tanks'
    },
    aseptic: {
      ruleTitle: 'Minimum level depends on how many fillers draw from the tank',
      ruleBody: 'One filler needs at least 25%, two fillers at least 50%. After a product switch the tank is emptied, cleaned (CIP_EMPTY), and refilled to this level before filling starts.',
      live: 'Running aseptic tanks',
      liveHint: 'Current level against the minimum for one and two fillers',
      level: 'Level',
      activeLines: 'Active lines',
      minNow: 'Minimum for {lines} line(s)',
      minTwo: 'Minimum for 2 lines',
      tanks: 'Aseptic tanks',
      sterilizers: 'Sterilizers',
      sterilizersHint: 'Sterilize SFP product into the aseptic tanks'
    },
    orders: {
      table: 'Production orders',
      tableHint: 'Liters = packs × pack size; milk need uses the product milk content',
      milkHint: 'Full Cream 100% · flavoured 90% (project assumption)',
      footer: '{count} orders today · {liters} product · {milk} milk'
    },
    actual: {
      table: 'Production actuals',
      runningSince: 'Running',
      lines: 'Filling lines',
      linesHint: 'Liquid draw = packs/h × pack ml ÷ 1000 (FILLING_SPEED_UNIT)',
      note: {
        atMinLevel: 'Waited for AT-01 minimum level'
      }
    }
  },
  trace: {
    kind: {
      farm: 'Farm',
      tanker: 'Tanker',
      raw: 'Raw milk tank',
      process: 'Separation',
      storage: 'SFP storage',
      cream: 'Cream',
      mix: 'Mixing',
      aseptic: 'Aseptic tank',
      finished: 'Finished goods'
    },
    transferType: {
      receive: 'Receive',
      split: 'Split',
      mix: 'Mix',
      separation: 'Separation',
      'co-product': 'Co-product',
      transform: 'Transform',
      sterilize: 'Sterilize',
      fill: 'Fill'
    },
    sideInput: {
      premix: 'Premix (ingredient)'
    },
    allStages: 'All stages ({count})',
    openBackward: 'Backward trace',
    openForward: 'Forward trace',
    massBalance: 'Mass balance',
    balance: {
      opening: 'Opening',
      inflow: 'Inflow',
      output: 'Output',
      coProduct: 'Co-product',
      closing: 'Closing',
      variance: 'Variance',
      formula: 'Opening + inflow = output + co-product + closing + variance (MASS_BALANCE)'
    },
    inputs: 'Inputs',
    outputs: 'Outputs',
    noInputs: 'No recorded inputs (source batch)',
    noOutputs: 'No outputs yet',
    batches: {
      table: 'Batches',
      tableHint: 'One tank = one batch per production date · select a row for mass balance'
    },
    transfers: {
      table: 'Transfers',
      tableHint: 'Each hop of the route is checked against the asset connection list'
    },
    graph: {
      title: 'Genealogy',
      subtitle: 'Columns follow the process: farm, tanker, raw milk, separation, storage, aseptic, finished goods',
      hintTitle: 'Select a node to highlight its full lineage',
      hintBody: 'Edges are transfers; hover an edge for its ID. Splits and mixes show as branches.',
      selected: 'Lineage of {id}',
      details: 'Batch details',
      clear: 'Clear'
    },
    pickTarget: 'Trace back from',
    pickSource: 'Trace forward from',
    summary: {
      farms: 'Farms',
      tankers: 'Tankers',
      batches: 'Linked batches',
      transfers: '{count} transfers',
      finished: 'Finished goods'
    },
    path: 'Trace path',
    pathBackward: 'Stages between the selected batch and the farms',
    pathForward: 'Stages reached from the selected batch',
    shareHint: 'Shares follow volume through every split and mix',
    backwardTable: 'Sources of {id}',
    forwardTable: 'Reached from {id}',
    lineageTransfers: 'Transfers in this lineage',
    audit: {
      table: 'Events',
      tableHint: 'Scenario events plus planning actions from this session',
      category: {
        receiving: 'Receiving',
        process: 'Process',
        planning: 'Planning'
      }
    }
  },
  planning: {
    aiLabel: {
      forecast: 'AI forecast',
      optimizer: 'Rule-based optimizer (AI placeholder)'
    },
    forecast: {
      availableToday: 'Predicted milk today',
      confidence: 'Confidence {pct}%',
      released: 'Released & stored',
      releasedCaption: 'Confirmed by QA',
      waiting: 'Not yet released',
      waitingCaption: 'Lab pending or on the way',
      tomorrow: 'Tomorrow',
      range: 'Range {min}–{max}',
      intake: 'Milk intake',
      intakeHint: 'Last 7 days and tomorrow · model refreshed {time}',
      legendActual: 'Actual',
      legendForecast: 'Forecast',
      demand: 'Milk demand of the plan',
      demandHint: 'From the current configuration',
      demandFooter: 'Milk need {milk} · released {available}',
      group: {
        plain: 'Full Cream',
        flavoured: 'Flavoured'
      },
      etas: 'Arrival & release predictions',
      etasHint: 'Model output, updated with live delivery data',
      eta: {
        arrival: 'Arrival time',
        labResult: 'Lab result'
      }
    },
    config: {
      changed: 'Changed from approved plan',
      matches: 'Same as {id}',
      reset: 'Reset to approved',
      toGenerate: 'Preview plan',
      orders: 'Orders',
      ordersHint: 'Quantity and priority per order',
      lines: 'Filling lines',
      linesHint: 'Speed and utilization; breakdowns are covered by utilization',
      speed: '{line} speed',
      utilization: 'Utilization',
      utilizationHint: 'Share of rated speed actually achieved',
      start: 'Plan start',
      changeover: 'Changeover',
      changeoverHint: 'Automatic downtime: Variant Change (60 min), Size Change (40 min), Paper Roll Change (15 min)',
      variantHint: '60 min pause. Hot CIP wash of pipes and machines to prevent flavour cross-contamination.',
      sizeHint: '40 min pause. Mechanical adjustment of cutter and carton folder.',
      paperHint: '15 min pause. Roll change only without machine disassembly.',
      cip: 'CIP durations',
      cipHint: 'Catalog marks these X; values below are scenario values',
      cipRule: {
        CIP_FLAVOUR: 'Chocolate or Strawberry to Full Cream',
        CIP_CH_ST: 'Chocolate to Strawberry or reverse',
        CIP_END_PRODUCTION: 'End of a production run'
      }
    },
    generate: {
      action: 'Generate plan',
      pendingEyebrow: 'Waiting for approval',
      pendingTitle: '{id} generated at {time}',
      pendingBody: 'A planner or supervisor approves it before it reaches the floor.',
      openApproval: 'Open approval',
      readyTitle: 'Preview below; generate to create a revision for approval',
      readyBody: 'The plan uses the current configuration and is checked against every catalog rule.',
      blocked: 'The preview has a rule violation; adjust the configuration first',
      preview: 'Plan preview',
      previewHint: '{start}–{end}',
      orders: 'Orders',
      checks: 'Rule checks',
      checksSummary: '{pass} pass · {warning} warning · {violation} violation · {na} not computable',
      blocks: 'Schedule blocks'
    },
    scenarios: {
      table: 'Scenarios',
      tableHint: 'Select a row to see its schedule and rule issues',
      detailHint: 'Schedule and rule issues for this scenario'
    },
    scenario: {
      baseline: {
        title: 'Recommended baseline',
        body: 'FL-01 Full Cream then Chocolate; FL-02 Full Cream export'
      },
      'split-chocolate': {
        title: 'Split chocolate across FL-01 and FL-02',
        body: 'FL-02 waits until AT-01 switches to Chocolate'
      },
      'split-naive': {
        title: 'Split chocolate without waiting',
        body: 'FL-02 starts Chocolate while AT-01 still holds Full Cream'
      },
      'fl02-breakdown': {
        title: 'FL-02 breakdown',
        body: 'All orders on FL-01'
      },
      'variant-60': {
        title: '60 min flavour change',
        body: 'Variant changeover takes the long field duration'
      },
      'milk-short': {
        title: 'TRK-B01 rejected',
        body: '13,000 L less milk available'
      }
    },
    recs: {
      eyebrow: 'Recommended schedule',
      title: 'Run Full Cream first on both lines, then Chocolate on FL-01',
      openSchedule: 'Open schedule',
      why: 'Why this schedule',
      whyHint: 'Derived from the rule checks',
      reason: {
        onTime: '{count} of {total} orders finish before their due time',
        milk: 'Milk need {required} fits within {available} released',
        changeover: 'One variant changeover ({min} min) instead of extra CIP',
        end: 'Last activity ends at {time}'
      },
      risks: 'Risks to watch',
      risksHint: 'Warnings and rules that cannot be computed yet',
      alternatives: 'Alerts & alternatives',
      alternativesHint: 'Each alert with a recommended response and its rule check',
      impact: 'Ends {end} ({delta}) · late orders {late}',
      trigger: {
        breakdown: 'Machine breakdown',
        capacity: 'Tank capacity',
        holding: 'Holding time risk',
        sequence: 'Alternative sequence',
        changeover: 'Long changeover',
        milk: 'Milk shortage'
      },
      alt: {
        fl02: { title: 'Move FL-02 orders to FL-01', body: 'Run the export order after local Full Cream with a paper change.' },
        rmt: { title: 'Clean RMT-03 before TRK-A03 is released', body: 'Start CIP now so the tank is ready for incoming milk.' },
        sfp: { title: 'Use or release SFP-05 first', body: 'Schedule SFP-05 UHT Full Cream before its holding limit or ask QA to decide.' },
        split: { title: 'Split chocolate across both lines', body: 'FL-02 joins after AT-01 switches product to finish earlier.' },
        variant: { title: 'Plan for a 60 min flavour change', body: 'Keep the sequence; chocolate finishes later but on time.' },
        milk: { title: 'Reduce or move an order', body: 'If a tanker is rejected, lower the lowest-priority order or move it to tomorrow.' }
      },
      balance: {
        title: 'Daily Milk Volume Balance (06:00 — 06:00 Cycle)',
        subtitle: 'Mathematical validation formula for daily milk volume integrity & accuracy',
        formula: 'Opening stock + Milk in = Output + Closing leftover',
        parameters: 'Balance Calculation Parameters',
        openingStock: 'Opening Stock',
        openingStockDesc: 'Total milk volume remaining across all tanks at 06:00 AM.',
        milkIn: 'Milk In (Road Tanker)',
        milkInDesc: 'Total raw milk volume unloaded from all road tankers throughout the day.',
        output: 'Finished Output',
        outputDesc: 'Total milk volume successfully packed and leaving the production lines.',
        leftover: 'Closing Leftover',
        leftoverDesc: 'Total milk volume remaining across holding tanks at 06:00 AM next morning.',
        startOfDay: 'Start of Day 06:00',
        endOfDay: 'End of Day 06:00 next day',
        roadTanker: 'Road Tanker',
        prodDay: 'Production Day',
        inflowTotal: 'Total Inflow',
        outflowTotal: 'Total Outflow & Leftover',
        balanced: 'BALANCED — INTEGRITY VERIFIED',
        balancedDesc: 'Volume balance integrity verified. Milk inflow exactly matches packed output and closing leftover.',
        surplus: 'SURPLUS / UNALLOCATED MILK',
        deficit: 'MILK DEFICIT',
        calcLeftover: 'Auto-calculate Leftover',
        calcOutput: 'Calculate Max Output',
        calcMilkIn: 'Calculate Required Inflow',
        resetPlan: 'Use Recommended Schedule',
        resetStandard: '24-Hour Benchmark',
        tipsTitle: 'Volume Balance Calculation & Validation Tips',
        tipsIntro: 'Mathematical validation formula to ensure daily milk volume balance integrity and accuracy (06:00 AM to 06:00 AM next day):',
                exportCsv: 'Export Balance CSV'
      },
      comparison: {
        title: 'Volume Balance: AI vs Without AI',
        subtitle: 'Evaluating volume balance parameters & efficiency with AI schedule vs unoptimized manual planning',
        withAi: 'With AI Recommendation',
        withoutAi: 'Without AI (Conventional)',
        formulaNote: 'Formula: Opening Stock + Milk In = Output + Closing Leftover',
        summaryTitle: 'Efficiency Comparison Summary',
        summaryBadge: '+8.4% Net Efficiency',
        yieldRate: 'Milk Yield / Efficiency',
        flushLoss: 'Prevented Flush Loss',
        leftoverStock: 'Closing Leftover Buffer',
        onTimeOrders: 'On-Time Order Completion',
        changeoverDowntime: 'Changeover & CIP Downtime',
        savedMilkTag: 'Saved 2,500 L Milk',
        savedTimeTag: 'Saved 1h 45m Downtime',
                conclusion: 'By running Full Cream first on both lines and Chocolate on FL-01, the AI optimizer prevents allergen flush CIP, saving 2,500 L of raw milk, eliminating 105 min of wash downtime, and ensuring 100% on-time orders with a 21,000 L safe closing stock.',
        tableTitle: 'Parameter & Performance Comparison Table',
        indicatorCol: 'Parameter & Indicator',
        withoutAiCol: 'Without AI (Conventional)',
        withAiCol: 'With AI Recommendation',
        deltaCol: 'Efficiency Impact',
        compactTitle: 'AI vs Conventional Efficiency Summary',
        viewFull: 'View Full Balance Details'
      }
    }
  },
  pages: {
    settings: {
      language: 'Language',
      languageHint: 'Applies to the whole workspace on this device',
      shift: 'Active shift',
      shiftValue: 'Shift A · 06:00–18:00',
      timezone: 'Plant timezone',
      timezoneValue: 'Asia/Jakarta (WIB)'
    },
    profile: {
      name: 'Name',
      role: 'Role',
      plant: 'Plant',
      shift: 'Shift',
      email: 'Email',
      openSettings: 'Open settings'
    },
    signedOut: {
      title: 'Signed out',
      description: 'This prototype does not keep a real session. Sign in to return to the plant workspace.'
    },
    notFound: {
      title: 'Page not found',
      description: 'This address does not match any menu.',
      action: 'Go to dashboard'
    }
  },
  guide: {
    quickStart: 'Quick start',
    quickStartHint: 'Five steps for a first session. Click a step to jump to its section.',
    toc: 'Contents',
    openInApp: 'Open in app:',
    tryLanguage: 'Try it here',
    contentLanguage: 'Guide content is in Bahasa Indonesia',
    contentLanguageHint: 'Switch the language to ID first (section 1) so menu names match the guide.',
    focus: {
      ai: 'AI focus',
      trace: 'Traceability focus'
    }
  }
} as const

type DeepString<T> = T extends string ? string : { [K in keyof T]: DeepString<T[K]> }
export type Messages = DeepString<typeof en>
