<script lang="ts">
  import { Users, UserPlus, Mail, Shield, X } from '@lucide/svelte';

  type Role = 'Owner' | 'Admin' | 'Editor';
  type Status = 'Active' | 'Invited';

  interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: Role;
    status: Status;
  }

  let members = $state<TeamMember[]>([
    { id: '1', name: 'Rajesh Hamal', email: 'rajesh@business.com.np', role: 'Owner', status: 'Active' },
    { id: '2', name: 'Sujata Koirala', email: 'sujata@business.com.np', role: 'Admin', status: 'Active' },
    { id: '3', name: 'Bikash Thapa', email: 'bikash@business.com.np', role: 'Editor', status: 'Invited' },
  ]);

  let showInviteForm = $state(false);
  let inviteEmail = $state('');
  let inviteRole = $state<Role>('Editor');

  function inviteMember() {
    if (!inviteEmail) return;
    members = [...members, {
      id: String(Date.now()),
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      status: 'Invited',
    }];
    inviteEmail = '';
    inviteRole = 'Editor';
    showInviteForm = false;
  }

  function removeMember(id: string) {
    members = members.filter(m => m.id !== id);
  }

  const roleBadgeColor: Record<Role, string> = {
    Owner: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    Admin: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    Editor: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  };

  const statusColor: Record<Status, string> = {
    Active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Invited: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  };
</script>

<svelte:head>
  <title>Team Management — Biswaas</title>
</svelte:head>

<div>
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold flex items-center gap-2">
        <Users class="h-6 w-6" /> Team Management
      </h1>
      <p class="mt-1 text-sm text-muted-foreground">Manage who can access your business dashboard.</p>
    </div>
    <button onclick={() => showInviteForm = !showInviteForm}
      class="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
      <UserPlus class="h-4 w-4" /> Invite Member
    </button>
  </div>

  <!-- Invite Form -->
  {#if showInviteForm}
    <div class="mt-4 rounded-lg border p-4">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-medium">Invite a New Member</h3>
        <button onclick={() => showInviteForm = false} class="text-muted-foreground hover:text-foreground">
          <X class="h-4 w-4" />
        </button>
      </div>
      <div class="flex flex-col gap-3 sm:flex-row">
        <input type="email" bind:value={inviteEmail} placeholder="Email address"
          class="flex-1 rounded-md border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
        <select bind:value={inviteRole}
          class="rounded-md border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
          <option value="Admin">Admin</option>
          <option value="Editor">Editor</option>
        </select>
        <button onclick={inviteMember}
          class="flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Mail class="h-4 w-4" /> Send Invite
        </button>
      </div>
    </div>
  {/if}

  <!-- Team Table -->
  <div class="mt-6 overflow-x-auto rounded-lg border">
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b bg-muted/50">
          <th class="px-4 py-3 text-left font-medium">Name</th>
          <th class="px-4 py-3 text-left font-medium">Email</th>
          <th class="px-4 py-3 text-left font-medium">Role</th>
          <th class="px-4 py-3 text-left font-medium">Status</th>
          <th class="px-4 py-3 text-right font-medium">Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each members as member}
          <tr class="border-b last:border-0 hover:bg-muted/30">
            <td class="px-4 py-3 font-medium">{member.name}</td>
            <td class="px-4 py-3 text-muted-foreground">{member.email}</td>
            <td class="px-4 py-3">
              <span class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium {roleBadgeColor[member.role]}">
                <Shield class="h-3 w-3" /> {member.role}
              </span>
            </td>
            <td class="px-4 py-3">
              <span class="rounded-full px-2 py-0.5 text-xs font-medium {statusColor[member.status]}">
                {member.status}
              </span>
            </td>
            <td class="px-4 py-3 text-right">
              {#if member.role !== 'Owner'}
                <button onclick={() => removeMember(member.id)}
                  class="rounded-md border px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950">
                  Remove
                </button>
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
