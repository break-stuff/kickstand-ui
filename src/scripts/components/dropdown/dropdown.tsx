import { Component, h, Prop, Host, Element, State, Listen } from '@stencil/core';
import componentUtils from '../../utils/componentUtils';

@Component({
    tag: 'c-dropdown'
})
export class Dropdown {
    dropdownId = componentUtils.uniqueId();
    $contents: HTMLElement;
    $control: HTMLElement;
    $focusableEls: HTMLElement[];

    @Element() $el: HTMLElement;

    @Prop() dropdownText: string;
    @Prop() dropdownAlignment: 'left' | 'right' = 'left';
    @Prop() buttonIcon: string;
    @Prop() buttonType: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'light' | 'dark' | 'link' = 'primary';
    @Prop() hollowButton: boolean;
    @Prop() clearButton: boolean;
    @Prop() hideButtonText: boolean;
    @Prop() megaMenu: boolean;

    @State() isExpanded: boolean = false;
    @State() focusIndex: number = 0;

    @Listen('keydown')
    handleKeyDown(e: KeyboardEvent) {
        const KEY_TAB = 9;
        const KEY_ESC = 27;

        switch (e.keyCode) {
            case KEY_TAB:
                this.handleTab(e);
                break;
            case KEY_ESC:
                this.handleEsc();
                break;
            default:
                break;
        }
    }

    handleEsc() {
        this.close();
    }

    handleTab(e: KeyboardEvent) {
        if (!this.isExpanded)
            return;

        e.preventDefault();

        if (e.shiftKey) {
            this.handleBackwardTab();
        } else {
            this.handleForwardTab();
        }
    }

    handleBackwardTab() {
        this.focusIndex = this.focusIndex === 0 ? this.$focusableEls.length - 1 : --this.focusIndex;
        this.$focusableEls[this.focusIndex].focus();
    }

    handleForwardTab() {
        this.focusIndex = this.$focusableEls.length - 1 === this.focusIndex ? 0 : ++this.focusIndex;
        this.$focusableEls[this.focusIndex].focus();
    }


    componentDidRender() {
        this.$focusableEls = Array.from(this.$contents.querySelectorAll(componentUtils.focusableElements));

        window.addEventListener('click', (e: any) => {
            let isChildElement = this.$el.contains(e.target)

            if (isChildElement)
                return;

            this.isExpanded = false;
        });
    }

    toggleDropdown() {
        this.isExpanded = !this.isExpanded;

        if (this.isExpanded && this.$focusableEls.length > 0)
            setTimeout(() => this.$focusableEls[0].focus(), 100);
    }

    close() {
        this.isExpanded = false;
        this.focusIndex = 0;
        setTimeout(() => this.$control.focus());
    }

    render() {
        let dropDownClasses = {
            'dropdown': true,
            'show': this.isExpanded,
            'mega-menu': this.megaMenu
        };

        let buttonClasses = {
            'dropdown-text': true,
            'sr-only': this.hideButtonText
        };

        let contentClasses = {
            'contents': true,
            'mega-menu-contents': this.megaMenu,
            'dropdown-contents': !this.megaMenu,
            [`align-${this.dropdownAlignment}`]: !this.megaMenu
        };

        return (
            <Host class={dropDownClasses}>
                <c-button
                    onClick={() => this.toggleDropdown()}
                    type={this.buttonType}
                    hollow={this.hollowButton}
                    clear={this.clearButton}
                    icon={this.buttonIcon}
                    cssClass="dropdown-button"
                    haspopup={true}
                    expanded={this.isExpanded}
                    controls={`dropdown-${this.dropdownId}`}
                    ref={el => this.$control = el.querySelector('button')}>
                    <span class={buttonClasses}>{this.dropdownText}</span>
                    <i class="fas fa-chevron-down dropdown-icon"></i>
                </c-button>
                <div id={`dropdown-${this.dropdownId}`}
                    class={contentClasses}
                    role={this.megaMenu ? '' : 'list'}
                    tabindex="-1"
                    ref={el => this.$contents = el}>
                    <slot />
                </div>
            </Host>
        );
    }
}