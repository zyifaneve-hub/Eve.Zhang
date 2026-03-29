import { ChangeDetectionStrategy, Component, signal, computed, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RecordService } from '../services/record.service';

interface Product {
  id: string;
  title: string;
  artist: string;
  price: number;
  format: string;
  condition: string;
  image: string;
  liked?: boolean;
}

@Component({
  selector: 'app-search',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="px-6 max-w-7xl mx-auto pt-8 pb-24">
      <section class="mb-2 relative">
        <div class="relative flex items-center group">
          <span class="absolute left-4 text-on-surface/40 group-focus-within:text-primary transition-colors">
            <span class="material-symbols-outlined">search</span>
          </span>
          <input 
            type="text" 
            id="search-input" 
            placeholder="搜索艺术家、专辑或风格..." 
            class="w-full bg-surface-container-low border-b border-outline-variant focus:border-primary focus:ring-0 text-sm md:text-base py-4 pl-12 pr-4 transition-all placeholder:text-on-surface/30 outline-none"
            [value]="searchQuery()"
            (input)="onSearchInput($event)"
            (focus)="isFocused.set(true)"
            (blur)="onBlur()"
          />
          
          @if (isFocused() && !searchQuery() && recentSearches().length > 0) {
            <div class="absolute top-full left-0 w-full z-40 bg-surface-container-low p-8 shadow-2xl border-t border-outline-variant/20">
              <h2 class="text-xs font-black tracking-[0.2em] uppercase text-on-surface/30 mb-6 flex items-center justify-between">
                最近搜索记录
                <button (mousedown)="clearRecentSearches($event)" class="text-[10px] underline underline-offset-4 hover:text-primary">清除全部</button>
              </h2>
              <ul class="space-y-4">
                @for (search of recentSearches(); track search) {
                  <li class="flex items-center justify-between text-sm group cursor-pointer" (mousedown)="setSearchQuery(search)">
                    <span class="flex items-center gap-3 text-on-surface/60 group-hover:text-on-surface transition-colors">
                      <span class="material-symbols-outlined text-base">history</span>
                      {{search}}
                    </span>
                    <span class="material-symbols-outlined text-base text-on-surface/20 group-hover:text-primary" (mousedown)="removeRecentSearch($event, search)">close</span>
                  </li>
                }
              </ul>
            </div>
          }
        </div>
      </section>

      <section class="mb-2 flex justify-end">
        <button (click)="isFilterOpen.set(true)" class="flex items-center gap-2 text-on-surface/60 hover:text-primary transition-colors shrink-0 pb-2 pl-2 relative">
          <span class="text-xs uppercase font-bold tracking-widest">筛选</span>
          <span class="material-symbols-outlined text-lg">filter_list</span>
          @if (activeFilterCount() > 0) {
            <span class="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
          }
        </button>
      </section>

      @if (!searchQuery() && !selectedFormat() && !selectedCondition() && minPrice() === null && maxPrice() === null) {
        <section class="mt-2 border-t border-outline-variant/20 pt-4">
          <h2 class="text-xs font-black tracking-[0.2em] uppercase text-on-surface/30 mb-4">大家都在搜</h2>
          <div class="flex flex-wrap gap-x-8 gap-y-4">
            <a href="#" (click)="$event.preventDefault(); setSearchQuery('City Pop')" class="text-sm md:text-base font-headline hover:text-primary transition-colors"># City Pop</a>
            <a href="#" (click)="$event.preventDefault(); setSearchQuery('坂本龙一')" class="text-sm md:text-base font-headline hover:text-primary transition-colors"># 坂本龙一</a>
            <a href="#" (click)="$event.preventDefault(); setSearchQuery('Blue Note Jazz')" class="text-sm md:text-base font-headline hover:text-primary transition-colors"># Blue Note Jazz</a>
            <a href="#" (click)="$event.preventDefault(); setSearchQuery('180g')" class="text-sm md:text-base font-headline hover:text-primary transition-colors"># 180g 重磅</a>
            <a href="#" (click)="$event.preventDefault(); setSearchQuery('限定彩色盘')" class="text-sm md:text-base font-headline hover:text-primary transition-colors"># 限定彩色盘</a>
            <a href="#" (click)="$event.preventDefault(); setSearchQuery('初版首印')" class="text-sm md:text-base font-headline hover:text-primary transition-colors"># 初版首印</a>
          </div>
        </section>

        <section class="mt-16 border-t border-outline-variant/20 pt-12">
          <h2 class="text-xs font-black tracking-[0.2em] uppercase text-on-surface/30 mb-8">推荐唱片</h2>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            @for (item of recommendedProducts(); track item.id) {
              <a [routerLink]="['/product', item.id]" class="group flex flex-col cursor-pointer">
                <div class="relative aspect-square overflow-hidden bg-surface-container-low mb-4 rounded-lg">
                  <img [src]="item.image" [alt]="item.title" class="w-full h-full object-cover transition-all duration-700 scale-100 group-hover:scale-110" referrerpolicy="no-referrer" />
                  <div class="absolute top-2 right-2 bg-primary text-on-primary text-[10px] px-2 py-1 font-bold tracking-widest">[{{item.format}}]</div>
                  <div class="absolute bottom-2 left-2 bg-surface/80 backdrop-blur-md px-2 py-1 text-[10px] text-primary border border-primary/20">{{item.condition}}</div>
                </div>
                <div class="space-y-1">
                  <h4 class="font-headline text-sm md:text-base font-bold group-hover:text-primary transition-colors truncate">{{item.title}}</h4>
                  <p class="font-body text-xs text-on-surface/50 truncate">{{item.artist}}</p>
                  <div class="flex justify-between items-center pt-2">
                    <span class="font-headline font-extrabold text-base">¥{{item.price}}</span>
                    <button (click)="toggleLike($event, item)" 
                            class="material-symbols-outlined transition-all duration-300 hover:scale-110 active:scale-95"
                            [class.animate-heart-pop]="item.liked"
                            [class.text-primary]="item.liked"
                            [class.text-on-surface]="!item.liked"
                            [class.opacity-30]="!item.liked"
                            [class.group-hover:text-primary]="!item.liked"
                            [style.font-variation-settings]="item.liked ? '&quot;FILL&quot; 1' : '&quot;FILL&quot; 0'">
                      favorite
                    </button>
                  </div>
                </div>
              </a>
            }
          </div>
        </section>
      } @else {
        <!-- Search Results -->
        <section class="mt-4">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-sm font-bold text-on-surface/70">找到 {{filteredProducts().length}} 件商品</h2>
          </div>
          
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            @for (item of filteredProducts(); track item.id) {
              <a [routerLink]="['/product', item.id]" class="group flex flex-col cursor-pointer">
                <div class="relative aspect-square overflow-hidden bg-surface-container-low mb-4 rounded-lg">
                  <img [src]="item.image" [alt]="item.title" class="w-full h-full object-cover transition-all duration-700 scale-100 group-hover:scale-110" referrerpolicy="no-referrer" />
                  <div class="absolute top-2 right-2 bg-primary text-on-primary text-[10px] px-2 py-1 font-bold tracking-widest">[{{item.format}}]</div>
                  <div class="absolute bottom-2 left-2 bg-surface/80 backdrop-blur-md px-2 py-1 text-[10px] text-primary border border-primary/20">{{item.condition}}</div>
                </div>
                <div class="space-y-1">
                  <h4 class="font-headline text-sm md:text-base font-bold group-hover:text-primary transition-colors truncate">{{item.title}}</h4>
                  <p class="font-body text-xs text-on-surface/50 truncate">{{item.artist}}</p>
                  <div class="flex justify-between items-center pt-2">
                    <span class="font-headline font-extrabold text-base">¥{{item.price}}</span>
                    <button (click)="toggleLike($event, item)" 
                            class="material-symbols-outlined transition-all duration-300 hover:scale-110 active:scale-95"
                            [class.animate-heart-pop]="item.liked"
                            [class.text-primary]="item.liked"
                            [class.text-on-surface]="!item.liked"
                            [class.opacity-30]="!item.liked"
                            [class.group-hover:text-primary]="!item.liked"
                            [style.font-variation-settings]="item.liked ? '&quot;FILL&quot; 1' : '&quot;FILL&quot; 0'">
                      favorite
                    </button>
                  </div>
                </div>
              </a>
            }
          </div>
          
          @if (filteredProducts().length === 0) {
            <div class="py-20 text-center text-on-surface/50">
              <span class="material-symbols-outlined text-4xl mb-4 opacity-50">search_off</span>
              <p>没有找到符合条件的商品</p>
              <button (click)="resetFilters()" class="mt-4 px-6 py-2 rounded-full border border-outline-variant hover:bg-surface-container transition-colors text-sm">清除筛选条件</button>
            </div>
          }
        </section>
      }
    </div>

    <!-- Filter Drawer -->
    @if (isFilterOpen()) {
      <div class="fixed inset-0 z-50 flex justify-end">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" (click)="isFilterOpen.set(false)"></div>
        
        <!-- Drawer -->
        <div class="relative w-full max-w-md bg-surface h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          <div class="p-6 border-b border-outline-variant/20 flex justify-between items-center">
            <h2 class="text-xl font-headline font-bold">筛选条件</h2>
            <button (click)="isFilterOpen.set(false)" class="p-2 hover:bg-surface-container rounded-full transition-colors">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          
          <div class="p-6 flex-1 overflow-y-auto space-y-8">
            <!-- Format -->
            <div>
              <h3 class="text-sm font-bold tracking-widest uppercase text-on-surface/60 mb-4">格式 (Format)</h3>
              <div class="flex flex-wrap gap-3">
                @for (fmt of formats; track fmt.value) {
                  <button 
                    (click)="selectedFormat.set(selectedFormat() === fmt.value ? null : fmt.value)"
                    class="px-4 py-2 rounded-lg border text-sm font-medium transition-colors"
                    [class.bg-primary-container]="selectedFormat() === fmt.value"
                    [class.text-on-primary-container]="selectedFormat() === fmt.value"
                    [class.border-primary]="selectedFormat() === fmt.value"
                    [class.border-outline-variant]="selectedFormat() !== fmt.value"
                    [class.text-on-surface]="selectedFormat() !== fmt.value"
                    [class.hover:bg-surface-container]="selectedFormat() !== fmt.value"
                  >
                    {{fmt.label}}
                  </button>
                }
              </div>
            </div>

            <!-- Condition -->
            <div>
              <h3 class="text-sm font-bold tracking-widest uppercase text-on-surface/60 mb-4">品相 (Condition)</h3>
              <div class="flex flex-wrap gap-3">
                @for (cond of conditions; track cond) {
                  <button 
                    (click)="selectedCondition.set(selectedCondition() === cond ? null : cond)"
                    class="px-4 py-2 rounded-lg border text-sm font-medium transition-colors"
                    [class.bg-primary-container]="selectedCondition() === cond"
                    [class.text-on-primary-container]="selectedCondition() === cond"
                    [class.border-primary]="selectedCondition() === cond"
                    [class.border-outline-variant]="selectedCondition() !== cond"
                    [class.text-on-surface]="selectedCondition() !== cond"
                    [class.hover:bg-surface-container]="selectedCondition() !== cond"
                  >
                    {{cond}}
                  </button>
                }
              </div>
            </div>
            
            <!-- Price Range -->
            <div>
              <h3 class="text-sm font-bold tracking-widest uppercase text-on-surface/60 mb-4">价格区间 (Price Range)</h3>
              <div class="flex items-center gap-4">
                <div class="relative flex-1">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface/50">¥</span>
                  <input 
                    type="number" 
                    [value]="minPrice() === null ? '' : minPrice()"
                    (input)="onMinPriceChange($event)"
                    placeholder="最低价" 
                    class="w-full bg-surface-container-low border border-outline-variant rounded-lg py-2 pl-8 pr-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <span class="text-on-surface/30">-</span>
                <div class="relative flex-1">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface/50">¥</span>
                  <input 
                    type="number" 
                    [value]="maxPrice() === null ? '' : maxPrice()"
                    (input)="onMaxPriceChange($event)"
                    placeholder="最高价" 
                    class="w-full bg-surface-container-low border border-outline-variant rounded-lg py-2 pl-8 pr-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div class="p-6 border-t border-outline-variant/20 flex gap-4 bg-surface">
            <button (click)="resetFilters()" class="flex-1 py-3 rounded-full border border-outline-variant text-on-surface font-bold hover:bg-surface-container transition-colors">
              重置
            </button>
            <button (click)="isFilterOpen.set(false)" class="flex-1 py-3 rounded-full bg-primary text-on-primary font-bold hover:opacity-90 transition-opacity">
              查看结果 ({{filteredProducts().length}})
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class SearchComponent implements OnInit {
  private recordService = inject(RecordService);

  isFocused = signal(false);
  isFilterOpen = signal(false);

  searchQuery = signal('');
  recentSearches = signal<string[]>(['Pink Floyd', 'Radiohead', 'City Pop']);
  selectedFormat = signal<string | null>(null);
  selectedCondition = signal<string | null>(null);
  minPrice = signal<number | null>(null);
  maxPrice = signal<number | null>(null);

  formats = [
    { value: 'Vinyl', label: '黑胶 (Vinyl)' },
    { value: 'CD', label: 'CD' },
    { value: 'Cassette', label: '磁带 (Cassette)' }
  ];
  conditions = ['M', 'NM', 'VG+', 'VG', 'G'];

  products = signal<Product[]>([]);

  ngOnInit() {
    this.recordService.getRecords().subscribe({
      next: (data) => {
        this.products.set(data.map(item => ({
          ...item,
          format: item.format,
          condition: `${item.media_grade} / ${item.sleeve_grade}`,
          image: item.image_url
        })));
      },
      error: (err) => {
        console.error('Failed to load search records:', err);
      }
    });
  }

  recommendedProducts = computed(() => {
    return this.products().slice(0, 4);
  });

  filteredProducts = computed(() => {
    return this.products().filter(p => {
      // Search query
      if (this.searchQuery()) {
        const query = this.searchQuery().toLowerCase();
        if (!p.title.toLowerCase().includes(query) && !p.artist.toLowerCase().includes(query)) {
          return false;
        }
      }
      // Format
      if (this.selectedFormat()) {
        const isVinyl = this.selectedFormat() === 'Vinyl';
        const itemFormatUpper = p.format ? p.format.toUpperCase() : '';
        if (isVinyl && !itemFormatUpper.includes('LP')) {
          return false;
        } else if (!isVinyl && !itemFormatUpper.includes(this.selectedFormat()!.toUpperCase())) {
          return false;
        }
      }
      // Condition
      if (this.selectedCondition() && p.condition && !p.condition.includes(this.selectedCondition()!)) {
        return false;
      }
      // Price
      if (this.minPrice() !== null && p.price < this.minPrice()!) {
        return false;
      }
      if (this.maxPrice() !== null && p.price > this.maxPrice()!) {
        return false;
      }
      return true;
    });
  });

  activeFilterCount = computed(() => {
    let count = 0;
    if (this.selectedFormat()) count++;
    if (this.selectedCondition()) count++;
    if (this.minPrice() !== null || this.maxPrice() !== null) count++;
    return count;
  });

  onBlur() {
    setTimeout(() => this.isFocused.set(false), 200);
  }

  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  setSearchQuery(query: string) {
    this.searchQuery.set(query);
    this.isFocused.set(false);
  }

  onMinPriceChange(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.minPrice.set(val ? Number(val) : null);
  }

  onMaxPriceChange(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.maxPrice.set(val ? Number(val) : null);
  }

  resetFilters() {
    this.searchQuery.set('');
    this.selectedFormat.set(null);
    this.selectedCondition.set(null);
    this.minPrice.set(null);
    this.maxPrice.set(null);
  }

  clearRecentSearches(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.recentSearches.set([]);
  }

  removeRecentSearch(event: Event, search: string) {
    event.preventDefault();
    event.stopPropagation();
    this.recentSearches.update(searches => searches.filter(s => s !== search));
  }

  toggleLike(event: Event, item: Product) {
    event.preventDefault();
    event.stopPropagation();
    this.products.update(prods => prods.map(p => p.id === item.id ? { ...p, liked: !p.liked } : p));
  }
}

