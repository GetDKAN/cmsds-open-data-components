declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.svg';
declare module '*.css' {
	const css: string;
	export default css;
}

declare module '*.css?inline' {
	const css: string;
	export default css;
}
