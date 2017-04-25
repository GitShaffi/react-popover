import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import shouldPureComponentUpdate from 'react-pure-render/function';

//import './Popover.scss';

class PopoverStore {
	callback = null;

	hide() {
		this.register(null);
	}

	register(cb) {
		if (this.callback) {
			this.callback();
		}
		this.callback = cb;
	}

	unregister(cb) {
		if (this.callback === cb) {
			this.callback = null;
		}
	}
}

export const popoverStore = new PopoverStore();

export class Popover extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		triggerClassName: PropTypes.string,
		children: PropTypes.node,
		trigger: PropTypes.any.isRequired,
		position: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
		onShow: PropTypes.func,
		onHide: PropTypes.func,
	};

	static defaultProps = {
		position: 'top',
		triggerClassName: 'popover__trigger',
	};

	state = {
		isPopoverShown: false,
	};

	shouldComponentUpdate = shouldPureComponentUpdate;

	componentWillUnmount = () => {
		popoverStore.unregister(this.hide);
	};

	show = (e) => {
		popoverStore.register(this.hide);
		this.setState({ isPopoverShown: true });
		if (this.props.onShow) {
			this.props.onShow(e);
		}
	};

	hide = (e) => {
		this.setState({ isPopoverShown: false });
		if (this.props.onHide) {
			this.props.onHide(e);
		}
	};

	toggle = (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (this.state.isPopoverShown) {
			this.hide(e);
			popoverStore.unregister(this.hide);
		} else {
			this.show(e);
		}
	};

	render() {
		const { className, triggerClassName, position, trigger } = this.props;
		const popoverClasses = classnames('popover', className, `popover--${position}`, { 'popover--active': this.state.isPopoverShown });

		return (
			<div className={popoverClasses}>
				<a href="" onClick={this.toggle} className={triggerClassName}>{trigger}</a>
				<div className="popover__content">
					{this.props.children}
				</div>
			</div>
		);
	}
}

export class PopoverWrapper extends React.Component {
	static propTypes = {
		children: PropTypes.node,
	};

	hidePopovers() {
		popoverStore.hide();
	}

	render() {
		return (
			<div onClick={this.hidePopovers} onTouchEnd={this.hidePopovers} {...this.props}>
				{this.props.children}
			</div>
		);
	}
}


export default Popover;
