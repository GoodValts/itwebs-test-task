'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

type NameContextValue = {
	name: string;
	setName: (value: string) => void;
};

const NameContext = createContext<NameContextValue | undefined>(undefined);

export function NameProvider({ children }: { children: ReactNode }) {
	const [name, setName] = useState('');

	return <NameContext.Provider value={{ name, setName }}>{children}</NameContext.Provider>;
}

export function useName() {
	const ctx = useContext(NameContext);
	if (!ctx) {
		throw new Error('must be wrapped into NameContext.Provider');
	}
	return ctx;
}
