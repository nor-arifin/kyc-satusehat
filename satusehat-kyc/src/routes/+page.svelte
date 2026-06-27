<script>
	let submitting = false;
	let showPinModal = false;
	let pinValue = '';
	let pinError = '';
	let pinInput;
	export let form;

	function openPinModal() {
		if (submitting) return;

		const formEl = document.getElementById('main-form');
		if (!formEl.checkValidity()) {
			formEl.reportValidity();
			return;
		}

		pinValue = '';
		pinError = '';
		showPinModal = true;
		setTimeout(() => pinInput?.focus(), 100);
	}

	function handlePinInput(e) {
		const val = e.target.value.replace(/\D/g, '');
		if (val.length <= 6) pinValue = val;
	}

	function submitPin() {
		if (pinValue.length !== 6) {
			pinError = 'PIN harus 6 digit';
			return;
		}

		const formEl = document.getElementById('main-form');
		let hiddenPin = formEl.querySelector('input[name="pin"]');
		if (!hiddenPin) {
			hiddenPin = document.createElement('input');
			hiddenPin.type = 'hidden';
			hiddenPin.name = 'pin';
			formEl.appendChild(hiddenPin);
		}
		hiddenPin.value = pinValue;

		showPinModal = false;
		submitting = true;
		formEl.submit();
	}

	function closeModal() {
		showPinModal = false;
		pinError = '';
	}
</script>

<svelte:head>
	<title>SatuSehat KYC — Verifikasi Identitas</title>
</svelte:head>

<div class="page">
	<div class="card">
		<div class="header">
			<div class="logos">
				<img src="/kemenkes.webp" alt="Kemenkes RI" class="logo-kemenkes" />
				<div class="logo-divider"></div>
				<img src="/logo.jpg" alt="SatuSehat KYC" class="logo-app" />
			</div>
			<h1>Verifikasi Identitas</h1>
			<p class="subtitle">Masukkan data petugas verifikasi untuk memulai proses KYC</p>
		</div>

		<form id="main-form" method="post">
			<div class="fields">
				<div class="field">
					<label for="agent-name">Nama Lengkap</label>
					<input
						id="agent-name"
						name="agent-name"
						type="text"
						autocomplete="off"
						spellcheck="false"
						required
						placeholder="Masukkan nama lengkap"
					/>
				</div>

				<div class="field">
					<label for="agent-nik">NIK</label>
					<input
						id="agent-nik"
						name="agent-nik"
						type="text"
						inputmode="numeric"
						autocomplete="off"
						spellcheck="false"
						maxlength="16"
						required
						placeholder="16 digit NIK"
					/>
				</div>
			</div>

			<button class="btn" type="button" on:click={openPinModal} disabled={submitting}>
				{#if submitting}
					<span class="spinner"></span>
					Memproses...
				{:else}
					Mulai Verifikasi
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
						<path d="M5 12h14M12 5l7 7-7 7" />
					</svg>
				{/if}
			</button>
		</form>

		{#if form?.message && !showPinModal}
			<div class="alert alert-error">
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<circle cx="12" cy="12" r="10" />
					<path d="M12 8v4M12 16h.01" />
				</svg>
				<span>{form.message}</span>
			</div>
		{/if}
	</div>

	<div class="footer">
		<p>SatuSehat KYC &mdash; Sistem Verifikasi Identitas</p>
	</div>
</div>

{#if showPinModal}
	<div class="overlay" on:click={closeModal} role="presentation">
		<div class="modal" on:click|stopPropagation role="dialog" aria-labelledby="modal-title">
			<button class="modal-close" on:click={closeModal} aria-label="Tutup">
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M18 6L6 18M6 6l12 12" />
				</svg>
			</button>
			<h2 id="modal-title">Masukkan PIN</h2>
			<p class="modal-desc">Masukkan PIN 6 digit untuk melanjutkan</p>
			<div class="pin-input-wrap">
				<input
					type="text"
					inputmode="numeric"
					pattern="\d*"
					maxlength="6"
					class="pin-input"
					bind:value={pinValue}
					on:input={handlePinInput}
					bind:this={pinInput}
					on:keydown={(e) => { if (e.key === 'Enter') submitPin(); }}
					placeholder="123456"
				/>
			</div>
			{#if pinError}
				<p class="pin-error">{pinError}</p>
			{/if}
			<button class="btn btn-modal" on:click={submitPin} disabled={pinValue.length !== 6}>
				Konfirmasi
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
					<path d="M5 12h14M12 5l7 7-7 7" />
				</svg>
			</button>
		</div>
	</div>
{/if}

<style>
	.page {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
		background: url('/bg.png') center / cover no-repeat;
		font-family: 'Inter', system-ui, -apple-system, sans-serif;
	}

	.card {
		width: 100%;
		max-width: 440px;
		background: #fff;
		border-radius: 20px;
		padding: 2.5rem;
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
	}

	.header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.logos {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.logo-kemenkes {
		height: 64px;
		width: auto;
	}

	.logo-app {
		height: 64px;
		width: auto;
		border-radius: 12px;
	}

	.logo-divider {
		width: 1px;
		height: 52px;
		background: #e2e8f0;
	}

	h1 {
		font-size: 1.5rem;
		font-weight: 700;
		color: #0f172a;
		margin: 0 0 0.375rem;
	}

	.subtitle {
		font-size: 0.875rem;
		color: #64748b;
		margin: 0;
	}

	.fields {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		margin-bottom: 1.5rem;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.field label {
		font-size: 0.8125rem;
		font-weight: 600;
		color: #334155;
	}

	.field input {
		width: 100%;
		padding: 0.75rem 1rem;
		border: 1.5px solid #e2e8f0;
		border-radius: 10px;
		font-size: 0.9375rem;
		font-family: inherit;
		color: #0f172a;
		background: #f8fafc;
		transition: border-color 0.2s, box-shadow 0.2s;
		box-sizing: border-box;
	}

	.field input::placeholder {
		color: #94a3b8;
	}

	.field input:focus {
		outline: none;
		border-color: #2563eb;
		box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
		background: #fff;
	}

	.btn {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.8125rem 1.5rem;
		border: none;
		border-radius: 10px;
		font-size: 0.9375rem;
		font-weight: 600;
		font-family: inherit;
		color: #fff;
		background: linear-gradient(135deg, #2563eb, #1d4ed8);
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn:hover:not(:disabled) {
		background: linear-gradient(135deg, #1d4ed8, #1e40af);
		box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
		transform: translateY(-1px);
	}

	.btn:active:not(:disabled) {
		transform: translateY(0);
	}

	.btn:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.spinner {
		width: 18px;
		height: 18px;
		border: 2.5px solid rgba(255, 255, 255, 0.3);
		border-top-color: #fff;
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.alert {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		margin-top: 1.25rem;
		padding: 0.875rem 1rem;
		border-radius: 10px;
		font-size: 0.875rem;
		font-weight: 500;
		line-height: 1.4;
	}

	.alert-error {
		background: #fef2f2;
		color: #991b1b;
		border: 1px solid #fecaca;
	}

	.footer {
		margin-top: 1.5rem;
		text-align: center;
	}

	.footer p {
		font-size: 0.75rem;
		color: #64748b;
		margin: 0;
	}

	.overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
		padding: 1.5rem;
		backdrop-filter: blur(4px);
	}

	.modal {
		width: 100%;
		max-width: 380px;
		background: #fff;
		border-radius: 20px;
		padding: 2rem;
		position: relative;
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
		text-align: center;
	}

	.modal-close {
		position: absolute;
		top: 0.75rem;
		right: 0.75rem;
		background: none;
		border: none;
		cursor: pointer;
		color: #94a3b8;
		padding: 0.25rem;
		border-radius: 6px;
		display: flex;
		transition: color 0.2s;
	}

	.modal-close:hover {
		color: #475569;
	}

	.modal h2 {
		font-size: 1.25rem;
		font-weight: 700;
		color: #0f172a;
		margin: 0 0 0.375rem;
	}

	.modal-desc {
		font-size: 0.875rem;
		color: #64748b;
		margin: 0 0 1.5rem;
	}

	.pin-input-wrap {
		display: flex;
		justify-content: center;
		margin-bottom: 1rem;
	}

	.pin-input {
		width: 180px;
		padding: 0.875rem 1rem;
		border: 2px solid #e2e8f0;
		border-radius: 12px;
		font-size: 1.75rem;
		font-family: inherit;
		font-weight: 700;
		color: #0f172a;
		text-align: center;
		letter-spacing: 0.5em;
		background: #f8fafc;
		transition: border-color 0.2s, box-shadow 0.2s;
		outline: none;
	}

	.pin-input:focus {
		border-color: #2563eb;
		box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
		background: #fff;
	}

	.pin-input::placeholder {
		letter-spacing: 0.25em;
		color: #cbd5e1;
		font-weight: 400;
	}

	.pin-error {
		color: #dc2626;
		font-size: 0.8125rem;
		font-weight: 500;
		margin: -0.5rem 0 1rem;
	}

	.btn-modal {
		width: 100%;
	}
</style>
