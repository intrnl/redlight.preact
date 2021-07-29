import { h } from 'preact';
import { forwardRef } from 'preact/compat';
import { useRef, useEffect } from 'preact/hooks';

import { useMergeRefs } from '~/lib/interactions';


export let Modal = forwardRef(
	function Modal (props, extRef) {
		let { children, open = false, onCancel, ...rest } = props;

		let ownRef = useRef();
		let ref = useMergeRefs(ownRef, extRef);

		// Users are able to instruct browsers to close the modal, the problem is
		// this wouldn't work well with one-way bindings. So we'll just prevent
		// default behavior here.
		let handleCancel = (ev) => {
			ev.preventDefault();
			onCancel?.(ev);
		};

		useEffect(() => {
			let node = ownRef.current;
			if (!node) return;

			if (open && !node.open) {
				node.showModal();
			}
			else if (!open && node.open) {
				node.close();
			}
		}, [open]);


		return (
			<dialog {...rest} ref={ref} onCancel={handleCancel}>
				{children}
			</dialog>
		);
	}
);
