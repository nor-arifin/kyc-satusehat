import { env } from '$env/dynamic/private';
import ihs from '$lib/ihs.js';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	async default({ request }) {
		const form = await request.formData();
		const pin = form.get('pin')?.toString();
		const name = form.get('agent-name')?.toString();
		const nik = form.get('agent-nik')?.toString();

		const expectedPin = env.PIN || '231196';
		if (pin !== expectedPin) return fail(403, { status: 'error', message: 'PIN salah' });

		if (!name || !nik) return fail(400, { status: 'error', message: 'Nama dan NIK wajib diisi' });

		const { metadata, data } = await ihs.kyc.generateValidationUrl({ name, nik });
		if ('url' in data) redirect(302, data.url);

		return fail(+metadata.code, { status: 'error', message: data.error });
	}
};
