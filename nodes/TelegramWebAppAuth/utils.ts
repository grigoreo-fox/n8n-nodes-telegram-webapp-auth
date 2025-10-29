
type NodeParameters = {
	additionalFields: {
		addFailedOutput: boolean;
	};
};

function ensureDecoded(raw: string) {
	return raw.includes("query_id%3D") ? decodeURIComponent(raw) : raw;
}

export function cleanInitData(raw: string) {
	const allowed = new Set([
		"auth_date",
		"query_id",
		"user",
		"hash",
		"chat_type",
		"chat_instance",
		"start_param",
		"can_send_after",
		"receiver",
		"signature",
	]);

	const decoded = ensureDecoded(raw);
	const src = new URLSearchParams(decoded);
	const clean = new URLSearchParams();
	for (const [k, v] of src) if (allowed.has(k)) clean.append(k, v);
	return clean.toString();
}

export const configuredOutputs = (parameters: NodeParameters) => {
	
	if(parameters.additionalFields.addFailedOutput) {
		return [
			{
				type: "main",
				displayName: "Success",
			},
			{
				type: "main",
				displayName: "Failed",
			},
		];
	}else {
		return [
			{
				type: "main",
			},
		];
	}
};
