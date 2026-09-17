import { TestBed } from '@angular/core/testing';
import { OrdenesCompra } from './ordenes-compra';

describe('OrdenesCompra', () => {
  let service: OrdenesCompra;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdenesCompra);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
