<template>
  <div class="h-screen flex items-center justify-center bg-white px-6">
    <div class="text-center">
      <div class="text-9xl font-black text-slate-100 mb-8 select-none">404</div>
      <h1 class="text-4xl font-bold text-slate-900 mb-4">Mission Aborted!</h1>
      <p class="text-lg text-slate-600 mb-10 max-w-md mx-auto">
        The page you are looking for has flown out of range or never existed. Let's get you back to base.
      </p>
      <router-link to="/" class="px-8 py-4 bg-emerald-600 text-white rounded-full font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/10 inline-block">
        Return Home
      </router-link>
    </div>
  </div>
</template>
