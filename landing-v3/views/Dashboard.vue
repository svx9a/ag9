<template>
  <div class="pt-24 min-h-screen bg-white text-slate-900">
    <div class="max-w-7xl mx-auto px-6 py-12">
      <!-- Welcome Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 class="text-4xl font-bold mb-2">{{ $t('dashboard.title') }}</h1>
          <p class="text-slate-500 font-medium italic">
            {{ $t('dashboard.hub') }} • {{ authStore.user?.name || $t('dashboard.pilot_mode') }}
          </p>
        </div>
        <div class="flex items-center gap-4">
          <div class="flex bg-slate-100 p-1 rounded-xl">
            <button v-for="lang in ['en', 'th']" :key="lang"
                    @click="changeLocale(lang)"
                    class="px-4 py-2 rounded-lg text-sm font-bold transition-all uppercase"
                    :class="[$i18n.locale === lang ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700']">
              {{ lang }}
            </button>
          </div>
          <button @click="handleLogout"
                  class="p-3 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-all border border-slate-200">
            <LogOut class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div class="flex gap-8 border-b border-slate-200 mb-12 overflow-x-auto no-scrollbar">
        <button v-for="tab in ['overview', 'affiliate', 'provider', 'admin', 'pilot', 'farmer']" :key="tab"
                @click="activeTab = tab"
                class="pb-4 text-sm font-black uppercase tracking-widest transition-all relative whitespace-nowrap"
                :class="activeTab === tab ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'">
          {{ tab }}
          <div v-if="activeTab === tab" class="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600"></div>
        </button>
      </div>

      <div v-if="activeTab === 'overview'">
        <!-- Enhanced Monitoring Header -->
        <div class="flex justify-between items-center mb-8">
          <div class="flex items-center gap-4 bg-slate-100 p-1 rounded-xl">
            <button @click="fetchDashboardData"
                    :disabled="isLoading"
                    class="p-2 rounded-lg text-slate-500 hover:text-emerald-600 transition-all">
              <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': isLoading }" />
            </button>
            <button @click="dashboardView = 'grid'"
                    :class="dashboardView === 'grid' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'"
                    class="px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2">
              <LayoutDashboard class="w-4 h-4" /> {{ $t('dashboard.ops_grid') }}
            </button>
            <button @click="dashboardView = 'focus'"
                    :class="dashboardView === 'focus' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'"
                    class="px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2">
              <Plane class="w-4 h-4" /> {{ $t('dashboard.flight_focus') }}
            </button>
          </div>
          <div class="flex items-center gap-4">
            <button @click="toggleRole"
                    :class="isAdmin ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'"
                    class="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-2">
              <ShieldCheck class="w-3.3 h-3" /> {{ isAdmin ? $t('dashboard.admin_mode') : $t('dashboard.pilot_mode') }}
            </button>
            <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">{{ $t('dashboard.global_status') }}</span>
            <div class="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase border border-emerald-100">
              <Signal class="w-3 h-3" /> {{ $t('dashboard.sys_online') }}
            </div>
          </div>
        </div>

        <!-- Quick Stats / Real Data Insights -->
        <div v-if="dashboardData" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-4">
            <div class="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
              <CloudRain class="w-5 h-5" />
            </div>
            <div>
              <p class="text-[10px] font-bold text-emerald-600 uppercase">{{ $t('dashboard.stats.weather') }}</p>
              <p class="text-sm font-black text-slate-900">{{ dashboardData.weather?.temp }}°C - {{ dashboardData.weather?.condition }}</p>
              <p class="text-[9px] text-emerald-500">{{ dashboardData.weather?.source }}</p>
            </div>
          </div>
          <div class="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-center gap-4">
            <div class="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white">
              <MapIcon class="w-5 h-5" />
            </div>
            <div>
              <p class="text-[10px] font-bold text-blue-600 uppercase">{{ $t('dashboard.stats.assets') }}</p>
              <p class="text-sm font-black text-slate-900">{{ dashboardData.farmAssets?.length }} {{ $t('dashboard.stats.connected') }}</p>
              <p class="text-[9px] text-blue-500">Source: Partner API</p>
            </div>
          </div>
          <div class="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-center gap-4">
            <div class="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white">
              <Zap class="w-5 h-5" />
            </div>
            <div>
              <p class="text-[10px] font-bold text-amber-600 uppercase">{{ $t('dashboard.stats.ai_insight') }}</p>
              <p class="text-sm font-black text-slate-900">{{ dashboardData.research?.idealMoisture }} {{ $t('dashboard.stats.optimal') }}</p>
              <p class="text-[9px] text-amber-500">Crop: {{ dashboardData.research?.crop }}</p>
            </div>
          </div>
          <div class="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center gap-4">
            <div class="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
              <Activity class="w-5 h-5" />
            </div>
            <div>
              <p class="text-[10px] font-bold text-slate-500 uppercase">{{ $t('dashboard.stats.system_health') }}</p>
              <p class="text-sm font-black text-slate-900">{{ (dashboardData.stats?.healthIndex * 100).toFixed(0) }}% {{ $t('dashboard.stats.optimal') }}</p>
              <p class="text-[9px] text-slate-400">{{ $t('dashboard.predictive_ai') }}</p>
            </div>
          </div>
        </div>

        <!-- Dashboard Views -->
        <div v-if="dashboardView === 'grid'" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <!-- Main Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <!-- Left Column: Map & Telemetry -->
            <div class="lg:col-span-8 space-y-8">
              <DroneMap :dronePosition="{ lat: 14.21, lng: 101.12 }" :path="flightPath" />
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <TelemetryWidget :telemetry="telemetry" />
                <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                  <h3 class="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">{{ $t('dashboard.stats.analytics') }}</h3>
                  <div class="space-y-4">
                    <div v-for="s in quickStats.slice(0, 2)" :key="s.key" class="flex justify-between items-center">
                      <div class="flex items-center gap-3">
                        <component :is="s.icon" class="w-4 h-4 text-emerald-600" />
                        <span class="text-xs font-bold text-slate-700">{{ s.label }}</span>
                      </div>
                      <span class="text-sm font-black text-slate-900">{{ s.value }}</span>
                    </div>
                  </div>
                  <button class="w-full mt-6 py-3 bg-slate-50 text-slate-600 text-[10px] font-black uppercase rounded-xl hover:bg-slate-100 transition-all">
                    {{ $t('dashboard.full_report') }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Right Column: Mission Control & Media -->
            <div class="lg:col-span-4 space-y-8">
              <MissionControl />
              <MediaCenter />
              <MissionHistory v-if="isAdmin" />
            </div>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in fade-in zoom-in-95 duration-500">
          <!-- Focus View: Full Map with Floating Telemetry -->
          <div class="lg:col-span-3 relative h-[700px]">
            <DroneMap :dronePosition="{ lat: 14.21, lng: 101.12 }" :path="flightPath" />
            <div class="absolute top-6 left-6 z-[1001] w-72">
              <TelemetryWidget :telemetry="telemetry" />
            </div>
          </div>
          <div class="space-y-8">
            <MissionControl />
            <div class="bg-emerald-600 rounded-3xl p-6 text-white shadow-lg shadow-emerald-900/20">
              <h4 class="font-black uppercase tracking-widest text-[10px] mb-4 opacity-80">{{ $t('dashboard.weather_alert') }}</h4>
              <div class="flex items-center gap-4 mb-2">
                <CloudRain class="w-8 h-8" />
                <div>
                  <div class="text-lg font-bold">{{ $t('dashboard.rain_expected') }}</div>
                  <div class="text-xs opacity-80">{{ $t('dashboard.approx', { n: 45 }) }}</div>
                </div>
              </div>
              <p class="text-[10px] font-medium opacity-80 leading-relaxed">
                {{ $t('dashboard.rain_msg') }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="activeTab === 'affiliate'">
        <AffiliateDashboard />
      </div>
      <div v-else-if="activeTab === 'provider'" class="min-h-[calc(100vh-300px)] bg-[#0a0c10] text-slate-300 font-sans -mx-6 -mb-12 rounded-b-3xl overflow-hidden flex flex-col">
        <!-- Top Status Bar -->
        <div class="h-14 border-b border-slate-800/50 bg-[#0d1117]/80 backdrop-blur-xl flex items-center justify-between px-8 z-10">
          <div class="flex items-center gap-6">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-lg flex items-center justify-center">
                <Activity class="w-5 h-5 text-white" />
              </div>
              <span class="text-white font-black tracking-tighter text-lg uppercase italic">GreenDay<span class="text-emerald-500">Ops</span></span>
            </div>
            <div class="h-4 w-[1px] bg-slate-800"></div>
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span class="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">{{ globalHealthScore }}% Global Health</span>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <button class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">
              Deploy Hub
            </button>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div class="max-w-[1600px] mx-auto space-y-8">
            <!-- High-Level Intelligence Row -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div v-for="stat in platformStats" :key="stat.id"
                   class="bg-[#0d1117] border border-slate-800/50 p-6 rounded-3xl hover:border-blue-500/30 transition-all group relative overflow-hidden">
                <div class="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl"></div>
                <div class="flex justify-between items-start mb-4">
                  <div :class="stat.iconBg" class="w-10 h-10 rounded-xl flex items-center justify-center">
                    <component :is="stat.icon" class="w-5 h-5" :class="stat.iconColor" />
                  </div>
                  <span :class="stat.trend > 0 ? 'text-emerald-400' : 'text-slate-500'" class="text-[10px] font-black bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                    {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}%
                  </span>
                </div>
                <div>
                  <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{{ stat.label }}</p>
                  <h3 class="text-3xl font-black text-white tracking-tighter">{{ stat.value }}</h3>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <!-- Center-Left: Multi-Tenant Oversight & Fleet Map -->
              <div class="lg:col-span-8 space-y-8">
                <!-- Agent Intelligence & Pulse -->
                <div class="bg-[#0d1117] border border-slate-800/50 rounded-[2.5rem] p-8 relative overflow-hidden">
                  <div class="absolute right-0 top-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>
                  <div class="flex items-center justify-between mb-8 relative z-10">
                    <div class="flex items-center gap-4">
                      <div class="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                        <Cpu class="w-6 h-6 text-emerald-400" />
                      </div>
                      <div>
                        <h2 class="text-xl font-black text-white uppercase tracking-tighter italic">GreenDay AI Agent</h2>
                        <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Mistral-Powered Core Active</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-6">
                      <div v-for="pulse in agentPulse" :key="pulse.label" class="text-right">
                        <p class="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">{{ pulse.label }}</p>
                        <p class="text-sm font-black text-white leading-none">{{ pulse.value }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Live Agent Activity -->
                  <div class="space-y-4 relative z-10">
                    <div v-for="log in agentLogs.slice(0, 3)" :key="log.id"
                         class="flex items-center gap-4 p-4 bg-slate-900/40 border border-slate-800/50 rounded-2xl hover:border-emerald-500/20 transition-all">
                      <div :class="log.status === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'"
                           class="w-8 h-8 rounded-lg flex items-center justify-center">
                        <component :is="log.icon" class="w-4 h-4" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between">
                          <p class="text-[10px] font-black text-white uppercase tracking-tight truncate">{{ log.action }}</p>
                          <span class="text-[9px] font-bold text-slate-500">{{ log.time }}</span>
                        </div>
                        <p class="text-[10px] text-slate-500 truncate mt-0.5">{{ log.details }}</p>
                      </div>
                    </div>
                  </div>

                  <button class="w-full mt-6 py-4 bg-slate-900/50 hover:bg-slate-800/50 border border-slate-800/50 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all">
                    View Agent Analytics
                  </button>
                </div>

                <!-- Multi-Tenant Control Panel -->
                <div class="bg-[#0d1117] border border-slate-800/50 rounded-[2.5rem] overflow-hidden">
                  <div class="p-8 border-b border-slate-800/50 flex items-center justify-between bg-slate-900/20">
                    <div>
                      <h2 class="text-xl font-black text-white uppercase tracking-tighter italic">Tenant Oversight</h2>
                      <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Managing {{ tenants.length }} Regional FarmHubs</p>
                    </div>
                    <div class="flex gap-2">
                      <div class="relative hidden md:block">
                        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                        <input type="text" placeholder="Search tenants..."
                               class="bg-slate-950 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-[10px] font-bold text-slate-300 focus:ring-2 focus:ring-blue-500/20 outline-none w-48 transition-all" />
                      </div>
                      <button class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20">
                        Deploy Hub
                      </button>
                    </div>
                  </div>
                  <div class="overflow-x-auto">
                    <table class="w-full text-left">
                      <thead class="bg-slate-900/40 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <tr>
                          <th class="px-8 py-4">FarmHub / Location</th>
                          <th class="px-6 py-4">Status</th>
                          <th class="px-6 py-4 text-center">Active Pilots</th>
                          <th class="px-6 py-4 text-center">Health</th>
                          <th class="px-8 py-4 text-right">Throughput</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-slate-800/50">
                        <tr v-for="tenant in tenants" :key="tenant.id" class="hover:bg-slate-800/20 transition-colors group cursor-pointer">
                          <td class="px-8 py-6">
                            <div class="flex items-center gap-4">
                              <div class="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-black text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                {{ tenant.id.split('-')[1] }}
                              </div>
                              <div>
                                <div class="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{{ tenant.name }}</div>
                                <div class="text-[10px] text-slate-500 font-medium">{{ tenant.location }}</div>
                              </div>
                            </div>
                          </td>
                          <td class="px-6 py-6">
                            <div class="flex items-center gap-2">
                              <span :class="tenant.status === 'online' ? 'bg-emerald-500' : 'bg-amber-500'" class="w-1.5 h-1.5 rounded-full"></span>
                              <span class="text-[10px] font-black uppercase tracking-tighter" :class="tenant.status === 'online' ? 'text-emerald-400' : 'text-amber-400'">
                                {{ tenant.status }}
                              </span>
                            </div>
                          </td>
                          <td class="px-6 py-6 text-center">
                            <span class="text-sm font-black text-white">{{ tenant.pilots }}</span>
                          </td>
                          <td class="px-6 py-6">
                            <div class="w-24 h-1.5 bg-slate-800 rounded-full mx-auto overflow-hidden">
                              <div :class="tenant.health > 90 ? 'bg-emerald-500' : 'bg-blue-500'"
                                   class="h-full rounded-full transition-all duration-1000"
                                   :style="{ width: tenant.health + '%' }"></div>
                            </div>
                          </td>
                          <td class="px-8 py-6 text-right">
                            <div class="text-sm font-black text-white">฿{{ tenant.throughput.toLocaleString() }}</div>
                            <div class="text-[8px] text-slate-500 font-bold uppercase">Monthly Rev</div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- Fleet Telemetry Aggregator -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div v-for="t in telemetryMetrics" :key="t.label" class="bg-[#0d1117] border border-slate-800/50 p-6 rounded-3xl">
                    <div class="flex items-center justify-between mb-4">
                      <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">{{ t.label }}</span>
                      <component :is="t.icon || Zap" class="w-4 h-4 text-blue-500 opacity-50" />
                    </div>
                    <div class="flex items-baseline gap-2">
                      <span class="text-2xl font-black text-white tracking-tighter">{{ t.value }}</span>
                      <span class="text-[10px] font-bold text-slate-500">{{ t.unit }}</span>
                    </div>
                    <div class="mt-4 h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div class="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full" :style="{ width: (t.value / (t.label === 'Latency' ? 100 : 1) * 100) + '%' }"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right Column: API Health & Real-time Logs -->
              <div class="lg:col-span-4 space-y-8">
                <!-- API Health Monitor -->
                <div class="bg-[#0d1117] border border-slate-800/50 rounded-[2.5rem] p-8">
                  <div class="flex items-center justify-between mb-8">
                    <h3 class="text-lg font-black text-white uppercase tracking-tighter flex items-center gap-3 italic">
                      <Cpu class="w-5 h-5 text-blue-500" />
                      API Pulse
                    </h3>
                  </div>
                  <div class="space-y-6">
                    <div v-for="api in apiEndpoints" :key="api.path" class="p-4 bg-slate-900/40 rounded-2xl border border-slate-800/50">
                      <div class="flex justify-between items-start mb-3">
                        <div>
                          <div class="flex items-center gap-2">
                            <span class="text-[8px] font-black px-1.5 py-0.5 rounded bg-slate-800 text-blue-400">{{ api.method }}</span>
                            <div class="text-[10px] font-black text-white uppercase tracking-widest">{{ api.path }}</div>
                          </div>
                          <div class="text-[8px] text-slate-500 font-bold font-mono mt-1">Status: {{ api.status }}</div>
                        </div>
                        <span :class="api.latency < 50 ? 'text-emerald-400' : 'text-amber-400'" class="text-[10px] font-mono font-black">
                          {{ api.latency }}ms
                        </span>
                      </div>
                      <div class="flex gap-1 h-2">
                        <div v-for="i in 20" :key="i"
                             :class="i === 15 ? 'bg-red-500/50' : i > 12 ? 'bg-amber-500/50' : 'bg-emerald-500/50'"
                             class="flex-1 rounded-sm opacity-80"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Real-time Event Stream -->
                <div class="bg-[#0d1117] border border-slate-800/50 rounded-[2.5rem] p-8 flex flex-col h-[400px]">
                  <div class="flex items-center justify-between mb-6">
                    <h3 class="text-lg font-black text-white uppercase tracking-tighter italic">Fleet Events</h3>
                    <div class="flex items-center gap-2">
                      <span class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></span>
                      <span class="text-[10px] font-black text-blue-500 uppercase tracking-widest">Live</span>
                    </div>
                  </div>
                  <div class="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                    <div v-for="event in fleetEvents" :key="event.id" class="flex gap-4 group">
                      <div class="flex flex-col items-center">
                        <div class="w-2 h-2 rounded-full mt-1.5"
                             :class="event.type === 'alert' ? 'bg-red-500' : event.type === 'takeoff' ? 'bg-emerald-500' : 'bg-blue-500'"></div>
                        <div class="flex-1 w-[1px] bg-slate-800 my-1"></div>
                      </div>
                      <div class="pb-4">
                        <div class="text-[10px] text-slate-500 font-mono mb-1">{{ event.time }}</div>
                        <div class="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">
                          <span class="uppercase font-black text-white mr-2">[{{ event.type }}]</span>
                          {{ event.drone }} at {{ event.location }}
                          <p v-if="event.message" class="text-[10px] text-red-400 mt-1 font-bold">{{ event.message }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="activeTab === 'admin'" class="min-h-[calc(100vh-300px)] bg-slate-100 font-sans flex flex-col -mx-6 -mb-12 rounded-b-3xl overflow-hidden">
        <!-- Top Stats Row -->
        <div class="grid grid-cols-2 md:grid-cols-6 gap-4 p-4 bg-white border-b border-slate-200">
          <div v-for="stat in summaryStats" :key="stat.key" class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p class="text-[10px] text-slate-500 uppercase font-black tracking-tighter">{{ $t(`admin.stats.${stat.key}`) }}</p>
            <div class="flex items-end justify-between mt-1">
              <p class="text-2xl font-black text-slate-900 leading-none">{{ stat.value }}</p>
              <span v-if="stat.trend" :class="`text-[10px] font-bold ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`">
                {{ stat.trend }}
              </span>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1 flex overflow-hidden min-h-[600px]">
          <!-- Left Sidebar (Admin Menu) -->
          <div class="w-20 md:w-64 bg-slate-900 flex flex-col text-slate-400">
            <div class="p-6 text-white font-black text-xl hidden md:block">{{ $t('admin.panel') }}</div>
            <nav class="flex-1 p-2 space-y-1">
              <button v-for="item in adminMenu" :key="item.key"
                      class="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-white/10 hover:text-white transition-all group">
                <component :is="item.icon" class="w-6 h-6 group-hover:text-orange-500" />
                <span class="text-sm font-bold hidden md:block">{{ $t(`admin.menu.${item.key}`) }}</span>
              </button>
            </nav>
          </div>

          <!-- Center: Map -->
          <div class="flex-1 relative bg-slate-200">
            <DroneMap
              :center="{ lat: 13.7367, lng: 100.5231 }"
              :zoom="6"
              :markers="adminMarkers"
              :showOverlays="false"
            />

            <!-- Floating Map Controls -->
            <div class="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
              <div class="bg-white p-2 rounded-xl shadow-lg border border-slate-200">
                <div class="flex items-center gap-2 mb-2">
                  <div class="w-3 h-3 bg-red-600 rounded-full"></div>
                  <span class="text-[10px] font-bold uppercase">{{ $t('admin.stats.pilots_online') }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 bg-emerald-600 rounded-full"></div>
                  <span class="text-[10px] font-bold uppercase">{{ $t('admin.farmers') }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Panel: Job Timeline -->
          <div class="w-80 bg-white border-l border-slate-200 flex flex-col hidden lg:flex">
            <div class="p-6 border-b border-slate-100">
              <h3 class="font-black text-slate-900 uppercase tracking-tight">{{ $t('admin.timeline') }}</h3>
            </div>
            <div class="flex-1 overflow-y-auto p-4 space-y-4">
              <div v-for="job in jobs" :key="job.id" class="p-4 bg-slate-50 rounded-2xl border border-slate-100 relative overflow-hidden">
                <div :class="`absolute top-0 left-0 w-1 h-full ${job.statusColor}`"></div>
                <div class="flex justify-between items-start mb-2">
                  <span :class="`text-[8px] font-black uppercase px-2 py-0.5 rounded-full text-white ${job.statusBg}`">
                    {{ job.status }}
                  </span>
                  <span class="text-[10px] text-slate-400">{{ job.time }}</span>
                </div>
                <p class="text-sm font-bold text-slate-900">{{ job.customer }}</p>
                <p class="text-[10px] text-slate-500 font-mono">{{ job.area }} • {{ job.price }}</p>
                <div class="mt-3 flex items-center gap-2">
                  <div class="w-6 h-6 bg-slate-200 rounded-full"></div>
                  <span class="text-[10px] font-medium text-slate-600">{{ $t('admin.pilot') }}: {{ job.pilot }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="activeTab === 'pilot'" class="min-h-[calc(100vh-300px)] bg-slate-900 font-sans -mx-6 -mb-12 rounded-b-3xl overflow-hidden pb-20 text-white">
        <!-- Pilot Header -->
        <header class="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/90 backdrop-blur-md z-10">
          <div class="flex items-center gap-3">
            <h1 class="text-xl font-bold">{{ $t('kaset.pilot.header') }}</h1>
          </div>
          <button
            @click="isPilotReady = !isPilotReady"
            class="flex items-center gap-2 px-4 py-2 rounded-full border transition-all"
            :class="isPilotReady ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-red-500/10 border-red-500 text-red-400'"
          >
            <div class="w-2 h-2 rounded-full" :class="isPilotReady ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'"></div>
            <span class="text-xs font-black uppercase">{{ isPilotReady ? $t('kaset.pilot.ready') : $t('kaset.pilot.not_ready') }}</span>
          </button>
        </header>

        <!-- Pilot Profile Summary -->
        <div class="m-4 p-6 bg-gradient-to-br from-red-900/40 to-slate-800 rounded-3xl border border-red-900/30">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-900/40">
              <User class="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 class="text-lg font-bold">Pilot Alpha-01</h2>
              <p class="text-slate-400 text-xs font-mono">ID: SF-99234-TH</p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-slate-900/50 p-3 rounded-xl border border-white/5">
              <p class="text-[10px] text-slate-500 uppercase font-bold">{{ $t('kaset.pilot.total_jobs') }}</p>
              <p class="text-xl font-black text-white">128</p>
            </div>
            <div class="bg-slate-900/50 p-3 rounded-xl border border-white/5">
              <p class="text-[10px] text-slate-500 uppercase font-bold">{{ $t('kaset.pilot.rating') }}</p>
              <p class="text-xl font-black text-amber-400">4.9 ★</p>
            </div>
          </div>
        </div>

        <!-- Pilot Menu Items -->
        <div class="px-4 space-y-3">
          <button
            v-for="item in pilotMenuItems"
            :key="item.key"
            @click="handlePilotMenuClick(item)"
            class="w-full bg-slate-800 p-5 rounded-2xl border border-slate-700/50 flex items-center gap-4 transition-transform active:scale-[0.98] group"
          >
            <div :class="`w-12 h-12 ${item.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`">
              <component :is="item.icon" :class="`w-6 h-6 ${item.iconColor}`" />
            </div>
            <div class="flex-1 text-left">
              <span class="text-sm font-bold text-slate-200">{{ $t(`kaset.pilot.menu.${item.key}`) }}</span>
              <p class="text-[10px] text-slate-500 mt-0.5">{{ $t(`kaset.pilot.menu_desc.${item.key}`) }}</p>
            </div>
            <ChevronRight class="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>
      <div v-else-if="activeTab === 'farmer'" class="min-h-[calc(100vh-300px)] bg-slate-50 font-sans -mx-6 -mb-12 rounded-b-3xl overflow-hidden pb-20">
        <!-- Farmer Header -->
        <header class="bg-gradient-to-r from-orange-500 to-red-600 p-6 text-white shadow-lg sticky top-0 z-10 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <h1 class="text-xl font-bold uppercase tracking-tighter">{{ $t('kaset.farmer.header') }}</h1>
          </div>
          <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Plane class="w-6 h-6 brightness-0 invert" />
          </div>
        </header>

        <!-- Hero Banner -->
        <div class="m-4 p-6 bg-white rounded-3xl shadow-sm border border-orange-100 flex items-center justify-between overflow-hidden relative group cursor-pointer" @click="handleCallDrone">
          <div class="z-10">
            <span class="inline-block px-3 py-1 bg-orange-100 text-orange-600 text-[10px] font-black uppercase rounded-full mb-2">Instant Booking</span>
            <h2 class="text-2xl font-black text-orange-600 leading-tight">
              {{ $t('kaset.farmer.banner_title') }}
            </h2>
            <p class="text-slate-500 text-sm mt-1 font-medium">{{ $t('kaset.farmer.banner_subtitle') }}</p>
            <button class="mt-4 bg-orange-600 text-white px-6 py-2 rounded-full text-sm font-black shadow-lg shadow-orange-200 group-hover:bg-orange-500 transition-all">
              {{ $t('kaset.farmer.banner_cta') }}
            </button>
          </div>
          <div class="absolute right-[-20px] top-0 opacity-10 group-hover:opacity-20 transition-opacity">
            <Plane class="w-40 h-40 text-orange-600 rotate-12" />
          </div>
        </div>

        <!-- Farmer Main Grid -->
        <div class="px-4 grid grid-cols-2 gap-4">
          <button
            v-for="item in farmerMenuItems"
            :key="item.key"
            @click="handleFarmerMenuClick(item)"
            class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center gap-3 transition-transform active:scale-95"
          >
            <div :class="`w-14 h-14 ${item.bgColor} rounded-2xl flex items-center justify-center`">
              <component :is="item.icon" :class="`w-8 h-8 ${item.iconColor}`" />
            </div>
            <span class="text-sm font-bold text-slate-700 text-center leading-tight">
              {{ $t(`kaset.farmer.menu.${item.key}`) }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import {
  LogOut, Plane, Activity, CloudRain, ShieldCheck, LayoutDashboard, Users, Zap, Signal, Map as MapIcon,
  Video, RefreshCw, Globe, Server, Database, ArrowUpRight, AlertCircle, CheckCircle, Fan, Radio,
  FileText, Search, Filter, CheckCircle2, AlertTriangle, XCircle,
  UserCheck, Clock, BarChart3, Settings, Package, Bell, Cpu,
  ChevronLeft, Gamepad2, Wallet, MapPin, History, Calculator, DollarSign, Calendar, PhoneCall, User, ChevronRight
} from 'lucide-vue-next';
import { useAuthStore } from '../stores';
import AffiliateDashboard from '../components/AffiliateDashboard.vue';
import DroneMap from '../components/dashboard/DroneMap.vue';
import TelemetryWidget from '../components/dashboard/TelemetryWidget.vue';
import MissionControl from '../components/dashboard/MissionControl.vue';
import MediaCenter from '../components/dashboard/MediaCenter.vue';
import MissionHistory from '../components/dashboard/MissionHistory.vue';
import { DroneApiService } from '../services/droneApi';

const route = useRoute();
const activeTab = ref(route.query.tab || 'overview');
const dashboardView = ref('grid'); // 'grid' or 'focus'
const isAdmin = ref(false); // Simulated Role-based Access
const isLoading = ref(false);
const dashboardData = ref(null);
const { locale, t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();

// --- Provider Dashboard Logic ---
const searchTerm = ref('');
const statusFilter = ref('');

// Admin Data
const summaryStats = [
  { key: 'total_hubs', value: '42', trend: '+2' },
  { key: 'pilots_online', value: '18', trend: '+5' },
  { key: 'pending_jobs', value: '12', trend: '-3' },
  { key: 'active_jobs', value: '06', trend: '+1' },
  { key: 'completed_today', value: '84', trend: '+12' },
  { key: 'statistics', value: '94%', trend: '+2.1%' }
];

const adminMenu = [
  { key: 'hubs', icon: ShieldCheck },
  { key: 'pilots', icon: Users },
  { key: 'prices', icon: Package },
  { key: 'income', icon: BarChart3 },
  { key: 'training', icon: MapIcon },
  { key: 'settings', icon: Settings }
];

const jobs = [
  { id: 1, customer: 'Khun Somchai (Ratchaburi)', area: '12.5 Rai', price: '฿2,500', time: '2 mins ago', status: 'Pending', statusBg: 'bg-amber-500', statusColor: 'bg-amber-500', pilot: '-' },
  { id: 2, customer: 'Khun Somsri (Nakhon Nayok)', area: '45.0 Rai', price: '฿9,000', time: '15 mins ago', status: 'Active', statusBg: 'bg-blue-500', statusColor: 'bg-blue-500', pilot: 'Alpha-01' },
  { id: 3, customer: 'Farmer Group (Tak)', area: '120.0 Rai', price: '฿24,000', time: '1 hr ago', status: 'Completed', statusBg: 'bg-emerald-500', statusColor: 'bg-emerald-500', pilot: 'Gamma-04' }
];

const adminMarkers = [
  { label: 'FarmHub Ratchaburi', pos: [13.5283, 99.8134], info: 'Jobs: 12', type: 'pilot' },
  { label: 'FarmHub Suphan', pos: [14.4745, 100.1222], info: 'Jobs: 8', type: 'pilot' },
  { label: 'Farmer: Khun Somchai', pos: [13.5000, 99.8000], type: 'farmer' },
  { label: 'Farmer: Khun Somsri', pos: [14.4500, 100.1000], type: 'farmer' }
];

  // Advanced Provider Data
  const agentPulse = computed(() => [
    { label: 'Neural Load', value: '12.4%' },
    { label: 'NDVI Index', value: cropHealth.value ? cropHealth.value.ndvi_score : '0.72' },
    { label: 'Decision Confidence', value: '0.998' }
  ]);

  const agentLogs = [
    { id: 1, action: 'Fleet Optimization', details: 'Re-routing Alpha-01 to bypass localized turbulence in Suphan Buri.', time: 'Just now', status: 'success', icon: Zap },
    { id: 2, action: 'Resource Allocation', details: 'Allocated 5 additional battery packs to Ratchaburi Hub for peak demand.', time: '5m ago', status: 'success', icon: Database },
    { id: 3, action: 'Anomaly Detected', details: 'Minor telemetry drift on Beta-09. Automatic recalibration initiated.', time: '12m ago', status: 'warning', icon: AlertCircle }
  ];

  const platformStats = [
    { id: 1, label: 'Global Fleet', value: '124', trend: 12, icon: Plane, iconBg: 'bg-blue-500/20', iconColor: 'text-blue-400' },
    { id: 2, label: 'Active Sessions', value: '42', trend: 8, icon: Activity, iconBg: 'bg-emerald-500/20', iconColor: 'text-emerald-400' },
    { id: 3, label: 'API Uptime', value: '99.9%', trend: 0.1, icon: Globe, iconBg: 'bg-indigo-500/20', iconColor: 'text-indigo-400' },
    { id: 4, label: 'System Load', value: '14.2%', trend: -2, icon: Cpu, iconBg: 'bg-amber-500/20', iconColor: 'text-amber-400' }
  ];

  const tenants = [
    { id: 'HUB-001', name: 'Ratchaburi Central', location: 'Western Thailand', status: 'online', pilots: 12, health: 98, throughput: 145000 },
    { id: 'HUB-002', name: 'Suphan Buri North', location: 'Central Thailand', status: 'online', pilots: 8, health: 94, throughput: 89000 },
    { id: 'HUB-003', name: 'Nakhon Nayok East', location: 'Eastern Thailand', status: 'warning', pilots: 15, health: 82, throughput: 112000 },
    { id: 'HUB-004', name: 'Chiang Mai Valley', location: 'Northern Thailand', status: 'online', pilots: 6, health: 96, throughput: 67000 }
  ];

  const telemetryMetrics = [
    { label: 'Latency', value: 24, unit: 'ms', status: 'optimal' },
    { label: 'Packet Loss', value: 0.02, unit: '%', status: 'optimal' },
    { label: 'Jitter', value: 1.2, unit: 'ms', status: 'optimal' }
  ];

  const apiEndpoints = [
    { path: '/v1/fleet/status', method: 'GET', status: 200, latency: 12 },
    { path: '/v1/telemetry/push', method: 'POST', status: 201, latency: 45 },
    { path: '/v1/auth/verify', method: 'GET', status: 200, latency: 8 }
  ];

  const fleetEvents = [
    { id: 1, type: 'takeoff', drone: 'Alpha-01', location: 'Ratchaburi', time: '2m ago' },
    { id: 2, type: 'landing', drone: 'Gamma-04', location: 'Suphan Buri', time: '8m ago' },
    { id: 3, type: 'alert', drone: 'Beta-09', location: 'Nakhon Nayok', time: '15m ago', message: 'Low Battery (15%)' }
  ];

  const globalHealthScore = ref(98.4);
const cropHealth = ref(null);

const globalDrones = ref([
  { id: 'T40-AG-001', tenantName: 'AgriHub Thailand', model: 'Agras T40', status: 'flying', location: 'Suphan Buri, TH', lastPing: '2s ago' },
  { id: 'T40-AG-002', tenantName: 'AgriHub Thailand', model: 'Agras T40', status: 'charging', location: 'Suphan Buri, TH', lastPing: '1m ago' },
  { id: 'T20-MK-88', tenantName: 'Mekong Rice AI', model: 'Agras T20P', status: 'flying', location: 'Can Tho, VN', lastPing: '500ms ago' },
  { id: 'M3M-ID-05', tenantName: 'IndoPalm Solutions', model: 'Mavic 3M', status: 'idle', location: 'Sumatra, ID', lastPing: '5m ago' },
  { id: 'T50-SD-X1', tenantName: 'Siam Durian Tech', model: 'Agras T50', status: 'maintenance', location: 'Chanthaburi, TH', lastPing: '1h ago' },
]);

const systemLogs = ref([
  { id: 'log-1024', timestamp: '10:42:05', tenant: 'AgriHub Thailand', action: 'POST /api/telemetry/stream', status: 'success', latency: '45ms' },
  { id: 'log-1023', timestamp: '10:41:58', tenant: 'Mekong Rice AI', action: 'GET /api/weather/forecast', status: 'success', latency: '120ms' },
  { id: 'log-1022', timestamp: '10:41:15', tenant: 'IndoPalm Solutions', action: 'AUTH /login/device', status: 'warning', latency: '850ms' },
  { id: 'log-1021', timestamp: '10:40:00', tenant: 'System', action: 'CRON /maintenance/cleanup', status: 'success', latency: '200ms' },
  { id: 'log-1020', timestamp: '10:38:45', tenant: 'Siam Durian Tech', action: 'POST /api/mission/upload', status: 'error', latency: 'TIMEOUT' },
  { id: 'log-1019', timestamp: '10:38:10', tenant: 'AgriHub Thailand', action: 'GET /api/drones/status', status: 'success', latency: '55ms' },
  { id: 'log-1018', timestamp: '10:37:55', tenant: 'Mekong Rice AI', action: 'POST /api/auth/refresh', status: 'error', latency: '401 Unauthorized' },
]);

const apiTrafficData = ref([
  { time: '10:00', reqs: 1200 },
  { time: '10:10', reqs: 1800 },
  { time: '10:20', reqs: 2200 },
  { time: '10:30', reqs: 2100 },
  { time: '10:40', reqs: 2800 },
  { time: '10:50', reqs: 2400 },
]);

const filteredLogs = computed(() => {
  return systemLogs.value.filter(log => {
    const matchesSearch =
      log.tenant.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      log.id.toLowerCase().includes(searchTerm.value.toLowerCase());

    const matchesStatus = statusFilter.value === 'all' || log.status === statusFilter.value;

    return matchesSearch && matchesStatus;
  });
});

const factors = computed(() => {
  const logs = filteredLogs.value;
  return {
    total: logs.length,
    success: logs.filter(l => l.status === 'success').length,
    warning: logs.filter(l => l.status === 'warning').length,
    error: logs.filter(l => l.status === 'error').length,
  };
});

const getDroneBadgeStyle = (status) => {
  const styles = {
    flying: 'bg-sky-100 text-sky-700 border-sky-200 animate-pulse',
    charging: 'bg-sky-100 text-sky-700 border-sky-200',
    maintenance: 'bg-red-100 text-red-700 border-red-200',
    idle: 'bg-slate-100 text-slate-700 border-slate-200',
  };
  return styles[status] || 'bg-slate-100 text-slate-700';
};

const fetchDashboardData = async () => {
  isLoading.value = true;
  const data = await DroneApiService.getDashboardSummary();
  if (data) {
    dashboardData.value = data;
    // Update telemetry from real data if available
    if (data.weather) {
      telemetry.value.temp = data.weather.temp;
      telemetry.value.condition = data.weather.condition;
    }
  }

  // Fetch GISTDA Crop Health Data
  const healthData = await DroneApiService.getCropHealth();
  if (healthData) {
    cropHealth.value = healthData;
  }

  isLoading.value = false;
};

onMounted(() => {
  fetchDashboardData();

  // Connect Socket.io for Real-time Drone Updates
  DroneApiService.socket.on('drone-status-update', (drones) => {
    if (drones && drones.length > 0) {
      const mainDrone = drones[0];
      // Update Telemetry
      telemetry.value = {
        altitude: mainDrone.status === 'flying' ? 3.5 : 0,
        speed: mainDrone.status === 'flying' ? 12.5 : 0,
        battery: Math.round(mainDrone.battery),
        gps: `${mainDrone.location.lat.toFixed(4)}, ${mainDrone.location.lng.toFixed(4)}`
      };

      // Update Drone Position for Map
      dronePosition.value = {
        lat: mainDrone.location.lat,
        lng: mainDrone.location.lng
      };

      // Add to Flight Path if flying
      if (mainDrone.status === 'flying') {
        flightPath.value.push([mainDrone.location.lat, mainDrone.location.lng]);
        // Keep only last 20 points
        if (flightPath.value.length > 20) {
          flightPath.value.shift();
        }
      }

      // Update Global Drones List
      globalDrones.value = drones.map(d => ({
        id: d.id,
        tenantName: 'SmartFarming Hub',
        model: d.model,
        status: d.status,
        location: `${d.location.lat.toFixed(2)}, ${d.location.lng.toFixed(2)}`,
        lastPing: 'Just now'
      }));
    }
  });
});

onUnmounted(() => {
  DroneApiService.socket.off('drone-status-update');
});

const changeLocale = (lang) => {
  locale.value = lang;
};

const handleLogout = () => {
  authStore.logout();
  router.push('/auth');
};

const toggleRole = () => {
  isAdmin.value = !isAdmin.value;
};

const telemetry = ref({
  altitude: 45.5,
  speed: 12.8,
  battery: 84,
  gps: '14.21, 101.12'
});

const flightPath = ref([
  [14.21, 101.12],
  [14.215, 101.125],
  [14.22, 101.13]
]);

const quickStats = [
  { key: 'area', label: 'Rai Covered', value: '12,480', trend: '+12%', icon: Activity },
  { key: 'hours', label: 'Flight Hours', value: '450h', trend: '+5.4%', icon: Plane },
  { key: 'savings', label: 'Chemical Saved', value: '15.2%', trend: '+2.1%', icon: CloudRain },
  { key: 'pilots', label: 'Active Pilots', value: '32', trend: 'Stable', icon: Users }
];

const fleet = [
  { id: 1, name: 'Nakhon Nayok Hub A (T50)', status: 'Active - Rice Spraying', battery: 84 },
  { id: 2, name: 'Nakhon Nayok Hub B (T40)', status: 'In Transit', battery: 62 },
  { id: 3, name: 'Saraburi Border Hub (P100)', status: 'Standby', battery: 100 }
];

const missions = [
  { id: 1, name: 'Rice Paddy Spraying - Nakhon Nayok City', date: 'Ongoing', active: true, progress: 68 },
  { id: 2, name: 'Fruit Orchard Analysis - Ban Na District', date: '2 hours ago', active: false, progress: 100 },
  { id: 3, name: 'Pest Control Mission - Ongkharak', date: 'Yesterday', active: false, progress: 100 }
];

// --- Pilot Dashboard Logic ---
const isPilotReady = ref(true);
const pilotMenuItems = [
  { key: 'pending', icon: Clock, bgColor: 'bg-amber-500/10', iconColor: 'text-amber-500' },
  { key: 'active', icon: Activity, bgColor: 'bg-emerald-500/10', iconColor: 'text-emerald-500' },
  { key: 'income', icon: Wallet, bgColor: 'bg-blue-500/10', iconColor: 'text-blue-500' },
  { key: 'drone_info', icon: Gamepad2, bgColor: 'bg-red-500/10', iconColor: 'text-red-500' },
  { key: 'location', icon: MapPin, bgColor: 'bg-purple-500/10', iconColor: 'text-purple-500' },
  { key: 'history', icon: History, bgColor: 'bg-slate-500/10', iconColor: 'text-slate-400' },
  { key: 'certs', icon: FileText, bgColor: 'bg-indigo-500/10', iconColor: 'text-indigo-400' }
];

const handlePilotMenuClick = (item) => {
  console.log('Pilot menu click:', item.key);
};

// --- Farmer Dashboard Logic ---
const farmerMenuItems = [
  { key: 'call_drone', icon: Plane, bgColor: 'bg-orange-100', iconColor: 'text-orange-600' },
  { key: 'calc_area', icon: Calculator, bgColor: 'bg-emerald-100', iconColor: 'text-emerald-600' },
  { key: 'price_check', icon: DollarSign, bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
  { key: 'booking', icon: Calendar, bgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
  { key: 'history', icon: History, bgColor: 'bg-amber-100', iconColor: 'text-amber-600' },
  { key: 'map_near', icon: MapIcon, bgColor: 'bg-rose-100', iconColor: 'text-rose-600' },
  { key: 'contact', icon: PhoneCall, bgColor: 'bg-slate-100', iconColor: 'text-slate-600' }
];

const handleCallDrone = () => {
  alert('Request Sent! TASK-' + Math.floor(Math.random() * 10000));
};

const handleFarmerMenuClick = (item) => {
  if (item.key === 'call_drone') {
    handleCallDrone();
  } else {
    console.log('Farmer menu click:', item.key);
  }
};
</script>

<style scoped>
@keyframes progress {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}
.animate-progress {
  animation: progress 2s ease-out forwards;
}

/* Transitions */
.fade-in { animation: fadeIn 0.5s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.slide-in-bottom { animation: slideInBottom 0.5s ease-out forwards; }
@keyframes slideInBottom { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
</style>
