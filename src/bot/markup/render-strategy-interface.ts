export interface IRenderStrategy {
	render(...data: any): string;
}