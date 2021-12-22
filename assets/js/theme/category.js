import { hooks } from '@bigcommerce/stencil-utils';
import CatalogPage from './catalog';
import compareProducts from './global/compare-products';
import FacetedSearch from './common/faceted-search';
import { createTranslationDictionary } from '../theme/common/utils/translations-utils';

export default class Category extends CatalogPage {
    constructor(context) {
        super(context);
        this.validationDictionary = createTranslationDictionary(context);
    }

    setLiveRegionAttributes($element, roleType, ariaLiveStatus) {
        $element.attr({
            role: roleType,
            'aria-live': ariaLiveStatus,
        });
    }

    makeShopByPriceFilterAccessible() {
        if (!$('[data-shop-by-price]').length) return;

        if ($('.navList-action').hasClass('is-active')) {
            $('a.navList-action.is-active').focus();
        }

        $('a.navList-action').on('click', () => this.setLiveRegionAttributes($('span.price-filter-message'), 'status', 'assertive'));
    }

    onReady() {
        this.arrangeFocusOnSortBy();

        $('[data-button-type="add-cart"]').on('click', (e) => this.setLiveRegionAttributes($(e.currentTarget).next(), 'status', 'polite'));

        this.makeShopByPriceFilterAccessible();

        compareProducts(this.context);

        if ($('#facetedSearch').length > 0) {
            this.initFacetedSearch();
        } else {
            this.onSortBySubmit = this.onSortBySubmit.bind(this);
            hooks.on('sortBy-submitted', this.onSortBySubmit);
        }

        $('a.reset-btn').on('click', () => this.setLiveRegionsAttributes($('span.reset-message'), 'status', 'polite'));
        document.getElementById('ADDALLTOCART_BUTTON').onclick = this.addToCart;

        this.ariaNotifyNoProducts();

        this.checkCart();
        
    }


    //This is the success function for the ajax call in checkCart()
    //It checks if a cart exists to decide if a delete cart button is needed
    checkCart_success(response) {
        if (response === undefined) {
            this.deleteDeleteButton();
            return;
        }
        else {
            if (response[0] === undefined) {
                this.deleteDeleteButton();
                return;
            }
            else {
                if (response[0].lineItems.physicalItems.length > 0) {
                    this.createDeleteButton();
                    return;
                }
                this.deleteDeleteButton();
                return;
            }
        }
    }

    //This deletes the delete cart button.
    deleteDeleteButton() {
        var button = document.getElementById("REMOVEALLFROMCART_BUTTON");
        if (button !== null)button.parentNode.removeChild(button);
    }

    //This creates the delete cart button
    createDeleteButton() {
        var button = document.createElement("button");
        button.classList.add("button");
        button.id="REMOVEALLFROMCART_BUTTON";
        button.style="border-color:rgb(255, 155, 155);width:300px;max-width:100%;display:inline-block;";
        button.onclick=this.removeFromCart;
        button.innerHTML="Delete cart";
        var divToAppend = document.getElementById("ADD_DELETE_DIV");
        divToAppend.appendChild(button);
    }

    //This makes an ajax call to retrieve cart data
    checkCart() {
        var self = this;
        $.ajax({
            type: "GET",
            url: "https://wade-hudgens6.mybigcommerce.com/api/storefront/carts",
            success: function(response) {self.checkCart_success(response)},
            error: function(response) {self.deleteDeleteButton()}
        });
    }

    //This adds special item to the cart
    addToCart() {
        $.ajax({
            type: "POST",
            url: 'https://wade-hudgens6.mybigcommerce.com/api/storefront/carts',
            data: JSON.stringify({
                "lineItems": [
                    {
                      "quantity": 1,
                      "productId": 112
                    }
                ]
            }),
            success: (function(response) {
                document.getElementById("REMOVEDCART_ALERTBOX").style.opacity = "0";
                document.getElementById("ADDEDCART_ALERTBOX").style.opacity = "0.8";
                setTimeout(()=>{document.getElementById("ADDEDCART_ALERTBOX").style.opacity = "0";location.reload()}, 750);
                checkCart();
            })
        });

        
    }

    //This deletes the current cart
    removeFromCart() {
        $.ajax({
            type: "GET",
            url: "https://wade-hudgens6.mybigcommerce.com/api/storefront/carts",
            success: function(response){
                        fetch('https://wade-hudgens6.mybigcommerce.com/api/storefront/carts/' + response[0].id, {
                            headers: {
                                "Content-Type": "application/json"
                            },
                            method: 'DELETE'
                        }).then(()=>{
                            document.getElementById("ADDEDCART_ALERTBOX").style.opacity = "0";
                            document.getElementById("REMOVEDCART_ALERTBOX").style.opacity = "0.8";
                            setTimeout(()=>{document.getElementById("REMOVEDCART_ALERTBOX").style.opacity = "0"; location.reload()}, 750);
                        });
            }
        });
    }
    
    

    
    
    
    ariaNotifyNoProducts() {
        const $noProductsMessage = $('[data-no-products-notification]');
        if ($noProductsMessage.length) {
            $noProductsMessage.focus();
        }
    }

    initFacetedSearch() {
        const {
            price_min_evaluation: onMinPriceError,
            price_max_evaluation: onMaxPriceError,
            price_min_not_entered: minPriceNotEntered,
            price_max_not_entered: maxPriceNotEntered,
            price_invalid_value: onInvalidPrice,
        } = this.validationDictionary;
        const $productListingContainer = $('#product-listing-container');
        const $facetedSearchContainer = $('#faceted-search-container');
        const productsPerPage = this.context.categoryProductsPerPage;
        const requestOptions = {
            config: {
                category: {
                    shop_by_price: true,
                    products: {
                        limit: productsPerPage,
                    },
                },
            },
            template: {
                productListing: 'category/product-listing',
                sidebar: 'category/sidebar',
            },
            showMore: 'category/show-more',
        };

        this.facetedSearch = new FacetedSearch(requestOptions, (content) => {
            $productListingContainer.html(content.productListing);
            $facetedSearchContainer.html(content.sidebar);

            $('body').triggerHandler('compareReset');

            $('html, body').animate({
                scrollTop: 0,
            }, 100);
        }, {
            validationErrorMessages: {
                onMinPriceError,
                onMaxPriceError,
                minPriceNotEntered,
                maxPriceNotEntered,
                onInvalidPrice,
            },
        });
    }
}
