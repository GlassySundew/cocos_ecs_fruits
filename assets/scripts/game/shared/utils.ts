
export function randomEnum<T extends object>(anEnum: T): T[keyof T] {

	const values = Object.values(anEnum).filter(v => typeof v === "number") as T[keyof T][];
	return values[Math.floor(Math.random() * values.length)];
}

export function randomElement<T>(arr: T[]): T {

	return arr[Math.floor(Math.random() * arr.length)];
}

export function formatCountdown(ms: number): string {

	if (ms < 0)
		ms = 0;

	const totalSeconds = Math.floor(ms / 1000);

	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	const two = (n: number) => n.toString().padStart(2, "0");

	if (hours > 0) {
		return `${two(hours)}:${two(minutes)}:${two(seconds)}`;
	} else {
		return `${two(minutes)}:${two(seconds)}`;
	}
}