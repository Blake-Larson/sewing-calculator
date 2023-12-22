// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
export const prerender = false;

export interface Project {
	name: '';
	number: number;
	components: Component[];
}

export interface Component {
	name: '';
	boltWidth: number | null;
	height: number | null;
	width: number | null;
	number: number | null;
	orientation: 'efficient' | 'vertical' | 'horizontal' | '';
}
export interface ShoppingListItem {
    name: string,
    length: number,
    amount: number,
}
