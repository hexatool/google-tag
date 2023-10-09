export default function format(s: unknown = ''): string {
	if (typeof s !== 'string') {
		throw new Error('format expects a string');
	}

	return s || '';
}
