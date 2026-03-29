import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-wantlist',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="px-4 max-w-3xl mx-auto pt-8">
      <div class="mb-8 flex flex-col gap-2 px-2">
        <p class="text-primary font-headline font-bold tracking-widest uppercase text-[10px]">Curated Collection</p>
        <h2 class="text-2xl md:text-3xl font-headline font-extrabold tracking-tighter text-on-surface">3 件追踪中</h2>
        <div class="flex items-center gap-4 text-xs font-label text-on-surface-variant">
          <span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse"></span> 2 可购</span>
          <span class="opacity-20">|</span>
          <span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-outline-variant"></span> 1 等待中</span>
        </div>
      </div>

      <div class="flex flex-col">
        @for (item of items; track item.id) {
          <a [routerLink]="['/product', item.id]" class="group relative flex gap-4 p-4 hover:bg-white/5 transition-all duration-300 border-b border-white/5 cursor-pointer">
            <div class="relative w-24 h-24 shrink-0 overflow-hidden rounded-lg shadow-lg">
              <img [src]="item.image" [alt]="item.title" class="w-full h-full object-cover" referrerpolicy="no-referrer" />
              <div class="absolute top-1 left-1">
                @if (item.status === 'available') {
                  <span class="bg-primary-container text-on-primary-container px-1.5 py-0.5 text-[8px] font-bold rounded-sm uppercase">现货</span>
                } @else {
                  <span class="bg-outline-variant text-on-surface px-1.5 py-0.5 text-[8px] font-bold rounded-sm uppercase">等待中</span>
                }
              </div>
            </div>
            
            <div class="flex-1 flex flex-col min-w-0">
              <div class="flex justify-between items-start">
                <h3 class="font-headline font-bold text-base text-on-surface truncate">{{item.title}}</h3>
                <button (click)="toggleLike($event, item)" 
                        class="transition-colors"
                        [class.text-primary]="item.liked"
                        [class.text-on-surface]="!item.liked"
                        [class.opacity-30]="!item.liked"
                        [class.group-hover:text-primary]="!item.liked">
                  <span class="material-symbols-outlined text-[20px]" [style.font-variation-settings]="item.liked ? '&quot;FILL&quot; 1' : '&quot;FILL&quot; 0'">favorite</span>
                </button>
              </div>
              <p class="text-on-surface-variant text-xs mb-2">{{item.artist}}</p>
              <div class="flex gap-2 mb-auto">
                <span class="text-[10px] bg-white/5 text-on-surface/60 px-2 py-0.5 rounded-full uppercase tracking-wider font-medium">{{item.format}}</span>
                <span class="text-[10px] bg-white/5 text-on-surface/60 px-2 py-0.5 rounded-full uppercase tracking-wider font-medium">{{item.condition}}</span>
              </div>
              <div class="flex items-center justify-between mt-2">
                <span class="font-headline font-extrabold text-base md:text-lg" [class.text-primary-container]="item.status === 'available'" [class.text-on-surface]="item.status === 'wait'" [class.opacity-40]="item.status === 'wait'">¥{{item.price}}</span>
                @if (item.status === 'available') {
                  <button (click)="$event.preventDefault(); $event.stopPropagation()" class="bg-primary-container text-on-primary-container w-8 h-8 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform">
                    <span class="material-symbols-outlined text-[18px]">shopping_bag</span>
                  </button>
                } @else {
                  <button (click)="$event.preventDefault(); $event.stopPropagation()" class="border border-outline-variant text-on-surface w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all">
                    <span class="material-symbols-outlined text-[18px]">notifications_active</span>
                  </button>
                }
              </div>
            </div>
          </a>
        }
      </div>
    </div>
  `
})
export class WantlistComponent {
  items = [
    { id: '1', title: 'Kid A Mnesia', artist: 'Radiohead', format: '3xLP', condition: 'Near Mint (NM)', price: '428.00', status: 'available', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8fBIddr_fyTWNSbEFAkunD-p94HorYBQfXd7dy9Vu4RscriRWq2c4jNOkgoK653h8hCxFev02IsQUcWDsdb1ha2jt-MyqE2exAvLYVswYDFaCfui9nSg_gD203u34g90EEJWPT0mYeXmyBN11DPf4VrhSyE75vCI4GPZFam2DknGk79XvryYwTKlCqa4_aXi2ZvikU_5cZlQ8cI3HQusH8AQMIK5scsvVAAxqgCTzOVUI4It35_gK663MM92UvvNWLx4U4TOKxqR4', liked: true },
    { id: '2', title: 'A Love Supreme', artist: 'John Coltrane', format: '180g', condition: 'Mint (M)', price: '580.00', status: 'wait', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7QHYX5Rou2YKKZphi474hbUlj7VHVz1t57Oqw0I0_aTWnKWMtsFTFO2nCnrRU38YHtnvxwgoU5lqWv3eMpa1LExjNnBC8yDenDfd3BBYutQX7h42mSTu0vDYgs7Z9uRgOBPzkb5JIJvOWjtpAo6Y54Pb7JBAic4gbSAKck7dbTLZj47jBjDtnp1DIIetYPvLkRLQTojjMIIPcR-1Uvyz-4W0g-dMAPso-OwymQkxzLLqmgVCt5qE4ESS6twVInE5CydBiYHSOvwyE', liked: true },
    { id: '3', title: 'Random Access Memories', artist: 'Daft Punk', format: '2xLP', condition: 'VG+', price: '315.00', status: 'available', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwvSqg8xEb6bipZmGJpzr7vg1VbIbl9x5WVNcPrPqcv4G8WWFemnrarrGBILFNUk-0uCNc1190O1Bws-e-p4R7Difvy_09jRcZQtRv5FOyEw1CsWst4VMTb9BK1Moa_SwNFByfyqQbgrOnPhGYLWev4LQ3exd197DFcX_IlMQKBHDeLhgfkPcbDAYzuy3Ybg6jqbqqzyHTxmfTkq8lw9m9_XqLnjk5_tExXDBBP_1gtO1-XPPfMLdG9TDVJYWz2Z7-yXZnau5UD1t1', liked: true },
  ];

  toggleLike(event: Event, item: any) {
    event.preventDefault();
    event.stopPropagation();
    item.liked = !item.liked;
  }
}
