'use client';

import type { CSSProperties } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ToastProvider() {
	return (
		<ToastContainer
			position="top-right"
			autoClose={2500}
			hideProgressBar={false}
			newestOnTop
			closeOnClick
			draggable
			pauseOnHover
			pauseOnFocusLoss
			limit={3}
			theme="light"
			toastStyle={{
				background: '#ffffff',
				color: '#000000',
				border: '1px solid rgba(15, 23, 42, 0.08)',
				borderRadius: '0.75rem',
				boxShadow: '0 12px 30px rgba(15, 23, 42, 0.12)',
			} as CSSProperties}
			toastClassName="!rounded-xl !shadow-lg !border !border-border/20"
			style={{
				'--toastify-color-success': '#16a34a',
				'--toastify-color-error': '#dc2626',
				'--toastify-color-warning': '#d97706',
				'--toastify-color-info': '#2563eb',
				'--toastify-color-progress-success': '#16a34a',
				'--toastify-color-progress-error': '#dc2626',
				'--toastify-color-progress-warning': '#d97706',
				'--toastify-color-progress-info': '#2563eb',
				'--toastify-toast-width': '360px',
			} as CSSProperties}
		/>
	);
}