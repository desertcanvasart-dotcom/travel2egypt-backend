import type { Schema, Struct } from '@strapi/strapi';

export interface BlogDetails extends Struct.ComponentSchema {
  collectionName: 'components_blog_details';
  info: {
    displayName: 'details';
    icon: 'file';
  };
  attributes: {
    featured: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    read_time: Schema.Attribute.String;
  };
}

export interface ContentCalloutBox extends Struct.ComponentSchema {
  collectionName: 'components_content_callout_boxes';
  info: {
    description: 'Highlighted info box for tips, warnings, or facts';
    displayName: 'Callout Box';
    icon: 'exclamation';
  };
  attributes: {
    icon: Schema.Attribute.String;
    text: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String;
    type: Schema.Attribute.Enumeration<
      ['info', 'tip', 'warning', 'fact', 'historical']
    > &
      Schema.Attribute.DefaultTo<'info'>;
  };
}

export interface ContentCtaBlock extends Struct.ComponentSchema {
  collectionName: 'components_content_cta_blocks';
  info: {
    description: 'Call to action with button';
    displayName: 'CTA Block';
    icon: 'hand-pointer';
  };
  attributes: {
    button_text: Schema.Attribute.String & Schema.Attribute.Required;
    button_url: Schema.Attribute.String & Schema.Attribute.Required;
    heading: Schema.Attribute.String;
    style: Schema.Attribute.Enumeration<['primary', 'secondary', 'outline']> &
      Schema.Attribute.DefaultTo<'primary'>;
    text: Schema.Attribute.Text;
  };
}

export interface ContentFaqBlock extends Struct.ComponentSchema {
  collectionName: 'components_content_faq_blocks';
  info: {
    description: 'Inline FAQ section';
    displayName: 'FAQ Block';
    icon: 'question-circle';
  };
  attributes: {
    questions: Schema.Attribute.Component<'content.faq-item', true>;
    title: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Frequently Asked Questions'>;
  };
}

export interface ContentFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_content_faq_items';
  info: {
    description: 'Single FAQ question and answer';
    displayName: 'FAQ Item';
    icon: 'question';
  };
  attributes: {
    answer: Schema.Attribute.RichText & Schema.Attribute.Required;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ContentGalleryBlock extends Struct.ComponentSchema {
  collectionName: 'components_content_gallery_blocks';
  info: {
    description: 'Image gallery with multiple photos';
    displayName: 'Gallery Block';
    icon: 'images';
  };
  attributes: {
    images: Schema.Attribute.Media<'images', true> & Schema.Attribute.Required;
    layout: Schema.Attribute.Enumeration<['grid', 'carousel', 'masonry']> &
      Schema.Attribute.DefaultTo<'grid'>;
    title: Schema.Attribute.String;
  };
}

export interface ContentImageBlock extends Struct.ComponentSchema {
  collectionName: 'components_content_image_blocks';
  info: {
    description: 'Image with caption and alt text';
    displayName: 'Image Block';
    icon: 'picture';
  };
  attributes: {
    alt_text: Schema.Attribute.String;
    caption: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    size: Schema.Attribute.Enumeration<['small', 'medium', 'large', 'full']> &
      Schema.Attribute.DefaultTo<'large'>;
  };
}

export interface ContentListBlock extends Struct.ComponentSchema {
  collectionName: 'components_content_list_blocks';
  info: {
    description: 'Titled list of items';
    displayName: 'List Block';
    icon: 'list-ul';
  };
  attributes: {
    items: Schema.Attribute.Component<'content.list-item', true>;
    style: Schema.Attribute.Enumeration<
      ['bullet', 'numbered', 'check', 'arrow']
    > &
      Schema.Attribute.DefaultTo<'bullet'>;
    title: Schema.Attribute.String;
  };
}

export interface ContentListItem extends Struct.ComponentSchema {
  collectionName: 'components_content_list_items';
  info: {
    description: 'Single item in a list';
    displayName: 'List Item';
    icon: 'arrow-right';
  };
  attributes: {
    subtext: Schema.Attribute.String;
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ContentQuoteBlock extends Struct.ComponentSchema {
  collectionName: 'components_content_quote_blocks';
  info: {
    description: 'Quotation with attribution';
    displayName: 'Quote Block';
    icon: 'quote-right';
  };
  attributes: {
    author: Schema.Attribute.String;
    quote: Schema.Attribute.Text & Schema.Attribute.Required;
    source: Schema.Attribute.String;
    year: Schema.Attribute.String;
  };
}

export interface ContentTextBlock extends Struct.ComponentSchema {
  collectionName: 'components_content_text_blocks';
  info: {
    description: 'Rich text section with optional heading';
    displayName: 'Text Block';
    icon: 'align-left';
  };
  attributes: {
    body: Schema.Attribute.RichText;
    heading: Schema.Attribute.String;
  };
}

export interface ContentVideoBlock extends Struct.ComponentSchema {
  collectionName: 'components_content_video_blocks';
  info: {
    description: 'Embedded video from YouTube or Vimeo';
    displayName: 'Video Block';
    icon: 'play-circle';
  };
  attributes: {
    caption: Schema.Attribute.String;
    title: Schema.Attribute.String;
    video_url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface CruiseItinerary extends Struct.ComponentSchema {
  collectionName: 'components_cruise_itineraries';
  info: {
    displayName: 'itinerary';
    icon: 'ship';
  };
  attributes: {
    departure_days: Schema.Attribute.String;
    details: Schema.Attribute.RichText;
    duration: Schema.Attribute.String;
    price: Schema.Attribute.Decimal;
    route: Schema.Attribute.String;
  };
}

export interface PricingTier extends Struct.ComponentSchema {
  collectionName: 'components_pricing_tiers';
  info: {
    displayName: 'tier';
    icon: 'priceTag';
  };
  attributes: {
    group_size: Schema.Attribute.String;
    price: Schema.Attribute.Decimal;
  };
}

export interface TourChildPricing extends Struct.ComponentSchema {
  collectionName: 'components_tour_child_pricings';
  info: {
    displayName: 'child_pricing';
    icon: 'child';
  };
  attributes: {
    child_age_limit: Schema.Attribute.Integer;
    child_discount_available: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    child_discount_percentage: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 100;
          min: 0;
        },
        number
      >;
  };
}

export interface TourDetails extends Struct.ComponentSchema {
  collectionName: 'components_tour_details';
  info: {
    displayName: 'details';
    icon: 'file';
  };
  attributes: {
    average_rating: Schema.Attribute.Decimal;
    duration: Schema.Attribute.String;
    exclusions: Schema.Attribute.RichText;
    group_size: Schema.Attribute.String;
    highlights: Schema.Attribute.RichText;
    important_info: Schema.Attribute.RichText;
    inclusions: Schema.Attribute.RichText;
    itinerary_detailed: Schema.Attribute.Component<'tour.itinerary-day', true>;
    itinerary_simple: Schema.Attribute.RichText;
    itinerary_type: Schema.Attribute.Enumeration<['simple', 'detailed']>;
    languages: Schema.Attribute.String;
    overview: Schema.Attribute.RichText;
    physical_level: Schema.Attribute.Enumeration<
      ['easy', 'moderate', 'challenging']
    >;
    pickup_time: Schema.Attribute.String;
    reviews: Schema.Attribute.Component<'tour.review', true>;
    what_to_bring: Schema.Attribute.RichText;
  };
}

export interface TourGroupDetails extends Struct.ComponentSchema {
  collectionName: 'components_tour_group_details';
  info: {
    displayName: 'group_details';
    icon: 'users';
  };
  attributes: {
    guaranteed_departure: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    maximum_group_size: Schema.Attribute.Integer;
    minimum_group_size_per_booking: Schema.Attribute.Integer;
  };
}

export interface TourGroupPricing extends Struct.ComponentSchema {
  collectionName: 'components_tour_group_pricings';
  info: {
    displayName: 'group_pricing';
    icon: 'users';
  };
  attributes: {
    currency: Schema.Attribute.String & Schema.Attribute.DefaultTo<'EUR'>;
    fixed_price: Schema.Attribute.Decimal & Schema.Attribute.Required;
    single_room_supplement: Schema.Attribute.Decimal &
      Schema.Attribute.DefaultTo<0>;
  };
}

export interface TourItineraryDay extends Struct.ComponentSchema {
  collectionName: 'components_tour_itinerary_days';
  info: {
    displayName: 'itinerary_day';
    icon: 'calendar';
  };
  attributes: {
    accommodation: Schema.Attribute.String;
    day_description: Schema.Attribute.RichText;
    day_number: Schema.Attribute.Integer;
    day_title: Schema.Attribute.String & Schema.Attribute.Required;
    meals: Schema.Attribute.String;
  };
}

export interface TourOperatingSchedule extends Struct.ComponentSchema {
  collectionName: 'components_tour_operating_schedules';
  info: {
    displayName: 'operating_schedule';
    icon: 'clock';
  };
  attributes: {
    departure_time: Schema.Attribute.String;
    operating_days: Schema.Attribute.String;
  };
}

export interface TourPackagePricing extends Struct.ComponentSchema {
  collectionName: 'components_tour_package_pricings';
  info: {
    displayName: 'package_pricing';
    icon: 'package';
  };
  attributes: {
    currency: Schema.Attribute.String & Schema.Attribute.DefaultTo<'EUR'>;
    deluxe_hotels: Schema.Attribute.Text;
    deluxe_single_supplement: Schema.Attribute.Decimal &
      Schema.Attribute.DefaultTo<0>;
    deluxe_tiers: Schema.Attribute.Component<'pricing.tier', true>;
    luxury_hotels: Schema.Attribute.Text;
    luxury_single_supplement: Schema.Attribute.Decimal &
      Schema.Attribute.DefaultTo<0>;
    luxury_tiers: Schema.Attribute.Component<'pricing.tier', true>;
    standard_hotels: Schema.Attribute.Text;
    standard_single_supplement: Schema.Attribute.Decimal &
      Schema.Attribute.DefaultTo<0>;
    standard_tiers: Schema.Attribute.Component<'pricing.tier', true>;
  };
}

export interface TourPricing extends Struct.ComponentSchema {
  collectionName: 'components_tour_pricings';
  info: {
    displayName: 'pricing';
    icon: 'dollar';
  };
  attributes: {
    horus_package_pricing: Schema.Attribute.Component<'pricing.tier', true>;
    pharaohs_package_pricing: Schema.Attribute.Component<'pricing.tier', true>;
    ra_package_pricing: Schema.Attribute.Component<'pricing.tier', true>;
  };
}

export interface TourReview extends Struct.ComponentSchema {
  collectionName: 'components_tour_reviews';
  info: {
    displayName: 'review';
    icon: 'star';
  };
  attributes: {
    country: Schema.Attribute.String;
    custumer_name: Schema.Attribute.String & Schema.Attribute.Required;
    rating: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 1;
        },
        number
      >;
    review_date: Schema.Attribute.Date;
    review_text: Schema.Attribute.Text;
    review_title: Schema.Attribute.String;
    verified_purchase: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
  };
}

export interface WikiAncientQuote extends Struct.ComponentSchema {
  collectionName: 'components_wiki_ancient_quotes';
  info: {
    description: 'Quote or ancient text with source and translation';
    displayName: 'Ancient Quote';
  };
  attributes: {
    original_text: Schema.Attribute.Text;
    source: Schema.Attribute.String & Schema.Attribute.Required;
    translation: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface WikiCaptionedImage extends Struct.ComponentSchema {
  collectionName: 'components_wiki_captioned_images';
  info: {
    description: 'Image with caption for wiki articles';
    displayName: 'Captioned Image';
  };
  attributes: {
    alt_text: Schema.Attribute.String;
    caption: Schema.Attribute.Text & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
  };
}

export interface WikiComparisonBox extends Struct.ComponentSchema {
  collectionName: 'components_wiki_comparison_boxes';
  info: {
    description: 'Side-by-side comparison of two entities';
    displayName: 'Comparison Box';
  };
  attributes: {
    content_left: Schema.Attribute.RichText & Schema.Attribute.Required;
    content_right: Schema.Attribute.RichText & Schema.Attribute.Required;
    title_left: Schema.Attribute.String & Schema.Attribute.Required;
    title_right: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface WikiCultCenter extends Struct.ComponentSchema {
  collectionName: 'components_wiki_cult_centers';
  info: {
    description: 'Major worship locations for gods';
    displayName: 'Cult Center';
  };
  attributes: {
    city: Schema.Attribute.String & Schema.Attribute.Required;
    significance: Schema.Attribute.Text;
    temple: Schema.Attribute.String;
  };
}

export interface WikiFactBox extends Struct.ComponentSchema {
  collectionName: 'components_wiki_fact_boxes';
  info: {
    description: 'Quick facts for kings, gods, dynasties';
    displayName: 'Fact Box';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface WikiFamilyMember extends Struct.ComponentSchema {
  collectionName: 'components_wiki_family_members';
  info: {
    description: 'Family relationships for pharaohs';
    displayName: 'Family Member';
  };
  attributes: {
    name: Schema.Attribute.String & Schema.Attribute.Required;
    notes: Schema.Attribute.Text;
    relationship: Schema.Attribute.Enumeration<
      ['father', 'mother', 'wife', 'son', 'daughter', 'brother', 'sister']
    > &
      Schema.Attribute.Required;
  };
}

export interface WikiTimelineEntry extends Struct.ComponentSchema {
  collectionName: 'components_wiki_timeline_entries';
  info: {
    description: 'Year or period with description for chronological events';
    displayName: 'Timeline Entry';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    year_or_period: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'blog.details': BlogDetails;
      'content.callout-box': ContentCalloutBox;
      'content.cta-block': ContentCtaBlock;
      'content.faq-block': ContentFaqBlock;
      'content.faq-item': ContentFaqItem;
      'content.gallery-block': ContentGalleryBlock;
      'content.image-block': ContentImageBlock;
      'content.list-block': ContentListBlock;
      'content.list-item': ContentListItem;
      'content.quote-block': ContentQuoteBlock;
      'content.text-block': ContentTextBlock;
      'content.video-block': ContentVideoBlock;
      'cruise.itinerary': CruiseItinerary;
      'pricing.tier': PricingTier;
      'tour.child-pricing': TourChildPricing;
      'tour.details': TourDetails;
      'tour.group-details': TourGroupDetails;
      'tour.group-pricing': TourGroupPricing;
      'tour.itinerary-day': TourItineraryDay;
      'tour.operating-schedule': TourOperatingSchedule;
      'tour.package-pricing': TourPackagePricing;
      'tour.pricing': TourPricing;
      'tour.review': TourReview;
      'wiki.ancient-quote': WikiAncientQuote;
      'wiki.captioned-image': WikiCaptionedImage;
      'wiki.comparison-box': WikiComparisonBox;
      'wiki.cult-center': WikiCultCenter;
      'wiki.fact-box': WikiFactBox;
      'wiki.family-member': WikiFamilyMember;
      'wiki.timeline-entry': WikiTimelineEntry;
    }
  }
}
