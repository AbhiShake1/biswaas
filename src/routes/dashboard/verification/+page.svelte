<script lang="ts">
  import { Shield, Upload, Globe, Phone, CheckCircle, Clock, AlertCircle } from '@lucide/svelte';

  type StepStatus = 'pending' | 'in_progress' | 'verified' | 'failed';

  interface VerificationStep {
    id: string;
    title: string;
    description: string;
    status: StepStatus;
    icon: typeof Shield;
  }

  let steps = $state<VerificationStep[]>([
    {
      id: 'pan',
      title: 'PAN Verification',
      description: 'Verify your business PAN (Permanent Account Number) issued by IRD Nepal',
      status: 'pending',
      icon: Shield,
    },
    {
      id: 'registration',
      title: 'Company Registration',
      description: 'Upload your company registration certificate from the Office of Company Registrar',
      status: 'pending',
      icon: Upload,
    },
    {
      id: 'domain',
      title: 'Domain Verification',
      description: 'Verify ownership of your business website by adding a DNS TXT record',
      status: 'pending',
      icon: Globe,
    },
    {
      id: 'phone',
      title: 'Contact Verification',
      description: 'Verify your business phone number via OTP',
      status: 'pending',
      icon: Phone,
    },
  ]);

  let panNumber = $state('');
  let phoneNumber = $state('');
  let otpCode = $state('');
  let otpSent = $state(false);
  let uploadedFile = $state<string | null>(null);

  const statusConfig: Record<StepStatus, { label: string; color: string; icon: typeof CheckCircle }> = {
    pending: { label: 'Pending', color: 'text-gray-400', icon: Clock },
    in_progress: { label: 'In Progress', color: 'text-yellow-500', icon: Clock },
    verified: { label: 'Verified', color: 'text-green-500', icon: CheckCircle },
    failed: { label: 'Failed', color: 'text-red-500', icon: AlertCircle },
  };

  function submitPan() {
    if (!panNumber.match(/^\d{9}$/)) return;
    const idx = steps.findIndex((s) => s.id === 'pan');
    steps[idx] = { ...steps[idx], status: 'in_progress' };
    // Mock verification delay
    setTimeout(() => {
      steps[idx] = { ...steps[idx], status: 'verified' };
    }, 2000);
  }

  function handleFileUpload(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files?.[0]) {
      uploadedFile = input.files[0].name;
      const idx = steps.findIndex((s) => s.id === 'registration');
      steps[idx] = { ...steps[idx], status: 'in_progress' };
      setTimeout(() => {
        steps[idx] = { ...steps[idx], status: 'verified' };
      }, 2500);
    }
  }

  function verifyDomain() {
    const idx = steps.findIndex((s) => s.id === 'domain');
    steps[idx] = { ...steps[idx], status: 'in_progress' };
    setTimeout(() => {
      steps[idx] = { ...steps[idx], status: 'verified' };
    }, 3000);
  }

  function sendOtp() {
    if (!phoneNumber.match(/^(\+977)?9[78]\d{8}$/)) return;
    otpSent = true;
  }

  function verifyOtp() {
    if (otpCode.length !== 6) return;
    const idx = steps.findIndex((s) => s.id === 'phone');
    steps[idx] = { ...steps[idx], status: 'in_progress' };
    setTimeout(() => {
      steps[idx] = { ...steps[idx], status: 'verified' };
    }, 1500);
  }

  let completedCount = $derived(steps.filter((s) => s.status === 'verified').length);
</script>

<svelte:head>
  <title>Business Verification — Biswaas Dashboard</title>
</svelte:head>

<div>
  <div>
    <h1 class="text-2xl font-bold">Business Verification</h1>
    <p class="mt-1 text-sm text-muted-foreground">Complete verification steps to earn the Verified Business badge on your profile</p>
  </div>

  <!-- Progress -->
  <div class="mt-6 rounded-lg border p-4">
    <div class="flex items-center justify-between">
      <span class="text-sm font-medium">Verification Progress</span>
      <span class="text-sm text-muted-foreground">{completedCount} of {steps.length} completed</span>
    </div>
    <div class="mt-2 h-2 rounded-full bg-muted">
      <div
        class="h-2 rounded-full bg-green-500 transition-all duration-500"
        style="width: {(completedCount / steps.length) * 100}%"
      ></div>
    </div>
  </div>

  <!-- Steps -->
  <div class="mt-8 space-y-6">
    <!-- PAN Verification -->
    <div class="rounded-lg border p-6">
      <div class="flex items-start justify-between">
        <div class="flex items-start gap-3">
          <Shield class="mt-0.5 h-5 w-5 text-muted-foreground" />
          <div>
            <h3 class="font-semibold">PAN Verification</h3>
            <p class="mt-1 text-sm text-muted-foreground">Enter your 9-digit PAN issued by Inland Revenue Department</p>
          </div>
        </div>
        <span class="flex items-center gap-1 text-sm {statusConfig[steps[0].status].color}">
          <svelte:component this={statusConfig[steps[0].status].icon} class="h-4 w-4" />
          {statusConfig[steps[0].status].label}
        </span>
      </div>
      <div class="mt-4 flex gap-2">
        <input
          type="text"
          bind:value={panNumber}
          placeholder="e.g., 123456789"
          maxlength={9}
          class="w-48 rounded-md border bg-background px-3 py-2 text-sm font-mono outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          disabled={steps[0].status === 'verified'}
        />
        <button
          onclick={submitPan}
          disabled={steps[0].status !== 'pending' || !panNumber.match(/^\d{9}$/)}
          class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Verify PAN
        </button>
      </div>
    </div>

    <!-- Company Registration Upload -->
    <div class="rounded-lg border p-6">
      <div class="flex items-start justify-between">
        <div class="flex items-start gap-3">
          <Upload class="mt-0.5 h-5 w-5 text-muted-foreground" />
          <div>
            <h3 class="font-semibold">Company Registration</h3>
            <p class="mt-1 text-sm text-muted-foreground">Upload your registration certificate (PDF or image, max 5 MB)</p>
          </div>
        </div>
        <span class="flex items-center gap-1 text-sm {statusConfig[steps[1].status].color}">
          <svelte:component this={statusConfig[steps[1].status].icon} class="h-4 w-4" />
          {statusConfig[steps[1].status].label}
        </span>
      </div>
      <div class="mt-4">
        {#if uploadedFile}
          <p class="text-sm text-muted-foreground">Uploaded: <span class="font-medium text-foreground">{uploadedFile}</span></p>
        {:else}
          <label class="flex cursor-pointer items-center gap-2 rounded-md border border-dashed px-4 py-6 text-center hover:bg-muted/50">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onchange={handleFileUpload}
              class="hidden"
              disabled={steps[1].status === 'verified'}
            />
            <Upload class="h-5 w-5 text-muted-foreground" />
            <span class="text-sm text-muted-foreground">Click to upload registration certificate</span>
          </label>
        {/if}
      </div>
    </div>

    <!-- Domain Verification -->
    <div class="rounded-lg border p-6">
      <div class="flex items-start justify-between">
        <div class="flex items-start gap-3">
          <Globe class="mt-0.5 h-5 w-5 text-muted-foreground" />
          <div>
            <h3 class="font-semibold">Domain Verification</h3>
            <p class="mt-1 text-sm text-muted-foreground">Prove ownership of your business website</p>
          </div>
        </div>
        <span class="flex items-center gap-1 text-sm {statusConfig[steps[2].status].color}">
          <svelte:component this={statusConfig[steps[2].status].icon} class="h-4 w-4" />
          {statusConfig[steps[2].status].label}
        </span>
      </div>
      <div class="mt-4 space-y-3">
        <div class="rounded-md bg-muted/50 p-4">
          <p class="text-sm font-medium">Add this TXT record to your DNS:</p>
          <div class="mt-2 rounded-md bg-background p-3 font-mono text-xs">
            <p><span class="text-muted-foreground">Type:</span> TXT</p>
            <p><span class="text-muted-foreground">Host:</span> _biswaas-verify</p>
            <p><span class="text-muted-foreground">Value:</span> biswaas-site-verification=bw_abc123def456</p>
          </div>
        </div>
        <button
          onclick={verifyDomain}
          disabled={steps[2].status !== 'pending'}
          class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Verify DNS Record
        </button>
      </div>
    </div>

    <!-- Phone Verification -->
    <div class="rounded-lg border p-6">
      <div class="flex items-start justify-between">
        <div class="flex items-start gap-3">
          <Phone class="mt-0.5 h-5 w-5 text-muted-foreground" />
          <div>
            <h3 class="font-semibold">Contact Verification</h3>
            <p class="mt-1 text-sm text-muted-foreground">Verify your business phone number via SMS OTP</p>
          </div>
        </div>
        <span class="flex items-center gap-1 text-sm {statusConfig[steps[3].status].color}">
          <svelte:component this={statusConfig[steps[3].status].icon} class="h-4 w-4" />
          {statusConfig[steps[3].status].label}
        </span>
      </div>
      <div class="mt-4 space-y-3">
        <div class="flex gap-2">
          <input
            type="tel"
            bind:value={phoneNumber}
            placeholder="+977 98XXXXXXXX"
            class="w-56 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            disabled={otpSent || steps[3].status === 'verified'}
          />
          <button
            onclick={sendOtp}
            disabled={otpSent || steps[3].status === 'verified'}
            class="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send OTP
          </button>
        </div>
        {#if otpSent && steps[3].status !== 'verified'}
          <div class="flex gap-2">
            <input
              type="text"
              bind:value={otpCode}
              placeholder="6-digit code"
              maxlength={6}
              class="w-36 rounded-md border bg-background px-3 py-2 text-sm font-mono outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <button
              onclick={verifyOtp}
              disabled={otpCode.length !== 6}
              class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Verify OTP
            </button>
          </div>
          <p class="text-xs text-muted-foreground">OTP sent to {phoneNumber}. Expires in 5 minutes.</p>
        {/if}
      </div>
    </div>
  </div>
</div>
